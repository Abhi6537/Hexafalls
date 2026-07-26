from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
import os
import sys

# Ensure backend root is in sys.path
sys.path.append(os.path.dirname(__file__))

import config
from generator.symptom_dist import generate_patient_distribution
from agents.orchestrator import Orchestrator
from generator.client import call_laptop2_generator
from ner.client import call_colab_ner

app = FastAPI(title="RareMatch AI Neomorphic Dashboard Server")

# Mount production React build static folder
frontend_build_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(frontend_build_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build_path, "assets")), name="assets")

# Temporary in-memory state store
state = {
    "patient_profile": None,
    "patient_note": "",
    "extracted_entities": None,
    "match_results": None
}

@app.get("/")
def serve_dashboard_root():
    """Serves the main neomorphic dashboard page on root."""
    build_index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(build_index_path):
        with open(build_index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
            
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())

@app.get("/api/state")
def get_current_state():
    """Returns the current state stored in memory."""
    return JSONResponse(content=state)

class ProcessDocumentRequest(BaseModel):
    text: str

ner_agent = None
orphanet_agent = None

@app.post("/api/process-document")
def api_process_document(req: ProcessDocumentRequest):
    """Parses real text into a patient profile using the local NER Agent."""
    global ner_agent, orphanet_agent
    if ner_agent is None:
        from agents.ner_agent import NERAgent
        from agents.orphanet_agent import OrphanetAgent
        ner_agent = NERAgent()
        orphanet_agent = OrphanetAgent()
        
    profile = ner_agent.process_document(req.text)
    
    # Verify and normalize disease with Orphanet
    verification = orphanet_agent.verify_disease(profile["disease"])
    profile["disease"] = verification["official_name"]
    profile["orphanet_verified"] = verification["is_verified"]
    profile["orphanet_id"] = verification.get("orphanet_id")
    
    state["patient_profile"] = profile
    state["patient_note"] = req.text
    state["extracted_entities"] = None
    state["match_results"] = None
    
    return JSONResponse(content={"status": "success", "state": state})

@app.post("/api/generate-twin")
def api_generate_twin():
    """Dummy endpoint to suppress frontend 405 errors during demo."""
    return JSONResponse(content={"status": "success", "message": "Twin generation bypassed for demo."})

import PyPDF2

@app.post("/api/upload-pdf")
async def api_upload_pdf(file: UploadFile = File(...)):
    """Parses a PDF file into a patient profile using the local NER Agent."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Must be a PDF file.")
        
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
                
        global ner_agent, orphanet_agent
        if ner_agent is None:
            from agents.ner_agent import NERAgent
            from agents.orphanet_agent import OrphanetAgent
            ner_agent = NERAgent()
            orphanet_agent = OrphanetAgent()
            
        profile = ner_agent.process_document(text)
        
        verification = orphanet_agent.verify_disease(profile["disease"])
        profile["disease"] = verification["official_name"]
        profile["orphanet_verified"] = verification["is_verified"]
        profile["orphanet_id"] = verification.get("orphanet_id")
        
        state["patient_profile"] = profile
        state["patient_note"] = text
        state["extracted_entities"] = None
        state["match_results"] = None
        
        return JSONResponse(content={"status": "success", "state": state})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/run-ner")
def api_run_ner():
    """Calls BioBERT endpoint to extract note phenotypes."""
    if not state["patient_note"]:
        raise HTTPException(status_code=400, detail="No narrative note generated.")
        
    entities = call_colab_ner(state["patient_note"])
    state["extracted_entities"] = entities
    return JSONResponse(content={"status": "success", "state": state})

class MatchTrialsRequest(BaseModel):
    persona: str = "doctor"

@app.post("/api/match-trials")
def api_match_trials(req: MatchTrialsRequest):
    """Executes orchestrator matching pipeline."""
    if not state["patient_profile"]:
        raise HTTPException(status_code=400, detail="No patient profile loaded.")
        
    orchestrator = Orchestrator()
    results = orchestrator.match_patient_pipeline(state["patient_profile"], limit=3, persona=req.persona)
    state["match_results"] = results
    return JSONResponse(content={"status": "success", "state": state})

@app.get("/api/patients")
def get_patients():
    """Retrieves all saved patients from Supabase."""
    if not config.supabase_client:
        return JSONResponse(content={"status": "error", "detail": "Supabase not configured."})
    
    try:
        response = config.supabase_client.table("patients").select("*").order("created_at", desc=True).execute()
        return JSONResponse(content={"status": "success", "data": response.data})
    except Exception as e:
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=500)

class SavePatientRequest(BaseModel):
    patient_id: str
    age: int
    sex: str
    phenotypes: list
    reports: list

@app.post("/api/save-patient")
def save_patient(req: SavePatientRequest):
    """Saves a patient and their match reports to Supabase."""
    if not config.supabase_client:
        return JSONResponse(content={"status": "error", "detail": "Supabase not configured."})
        
    try:
        # 1. Upsert Patient
        patient_data = {
            "patient_id": req.patient_id,
            "age": req.age,
            "sex": req.sex,
            "phenotypes": req.phenotypes
        }
        config.supabase_client.table("patients").upsert(patient_data).execute()
        
        # 2. Insert Match Reports (Delete old ones first to prevent duplicates on re-run)
        config.supabase_client.table("match_reports").delete().eq("patient_id", req.patient_id).execute()
        
        for report in req.reports:
            report_data = {
                "patient_id": req.patient_id,
                "trial_nct_id": report["match_report"]["trial_nct_id"],
                "trial_title": report["match_report"]["trial_title"],
                "match_percentage": report["match_report"]["match_percentage"],
                "eligibility_status": report["match_report"]["eligibility_status"],
                "explanation_md": report["explanation_md"]
            }
            config.supabase_client.table("match_reports").insert(report_data).execute()
            
        return JSONResponse(content={"status": "success", "message": "Patient and reports saved."})
    except Exception as e:
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=500)

@app.get("/api/patients/{patient_id}/reports")
def get_patient_reports(patient_id: str):
    """Retrieves all match reports for a specific patient."""
    if not config.supabase_client:
        return JSONResponse(content={"status": "error", "detail": "Supabase not configured."})
        
    try:
        response = config.supabase_client.table("match_reports").select("*").eq("patient_id", patient_id).order("match_percentage", desc=True).execute()
        
        # Format the response to match the frontend expectations
        formatted_reports = []
        for row in response.data:
            formatted_reports.append({
                "match_report": {
                    "trial_nct_id": row["trial_nct_id"],
                    "trial_title": row["trial_title"],
                    "match_percentage": row["match_percentage"],
                    "eligibility_status": row["eligibility_status"]
                },
                "explanation_md": row["explanation_md"]
            })
            
        return JSONResponse(content={"status": "success", "reports": formatted_reports})
    except Exception as e:
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=500)

@app.get("/{full_path:path}", response_class=HTMLResponse)
def serve_spa(full_path: str):
    """Catch-all for SPA routing."""
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
        
    build_index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(build_index_path):
        with open(build_index_path, "r", encoding="utf-8") as f:
            return f.read()
            
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return f.read()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8502)
