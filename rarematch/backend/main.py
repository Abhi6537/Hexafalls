from fastapi import FastAPI, HTTPException
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

@app.get("/", response_class=HTMLResponse)
def serve_dashboard():
    """Serves the main neomorphic dashboard page."""
    build_index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(build_index_path):
        with open(build_index_path, "r", encoding="utf-8") as f:
            return f.read()
            
    # Fallback to local index template if dist is not compiled
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        return f.read()

@app.get("/api/state")
def get_current_state():
    """Returns the current state stored in memory."""
    return JSONResponse(content=state)

@app.post("/api/generate-twin")
def api_generate_twin():
    """Generates patient parameters and calls GPT-2 narrative endpoint."""
    import random
    profile = generate_patient_distribution(patient_id=f"PAT-{random.randint(1000, 9999)}")
    state["patient_profile"] = profile
    
    p_summary = f"{profile['age']}yo {profile['sex']} diagnosed with Fabry disease presenting with {', '.join(profile['phenotypes'])}."
    
    # Call generator client
    note = call_laptop2_generator(p_summary)
    state["patient_note"] = note
    state["extracted_entities"] = None
    state["match_results"] = None
    
    return JSONResponse(content={"status": "success", "state": state})

@app.post("/api/run-ner")
def api_run_ner():
    """Calls BioBERT endpoint to extract note phenotypes."""
    if not state["patient_note"]:
        raise HTTPException(status_code=400, detail="No narrative note generated.")
        
    entities = call_colab_ner(state["patient_note"])
    state["extracted_entities"] = entities
    return JSONResponse(content={"status": "success", "state": state})

@app.post("/api/match-trials")
def api_match_trials():
    """Executes orchestrator matching pipeline."""
    if not state["patient_profile"]:
        raise HTTPException(status_code=400, detail="No patient profile loaded.")
        
    orchestrator = Orchestrator()
    results = orchestrator.match_patient_pipeline(state["patient_profile"], limit=3)
    state["match_results"] = results
    return JSONResponse(content={"status": "success", "state": state})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8502)
