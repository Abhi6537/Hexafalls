from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import uvicorn
import os

app = FastAPI(title="RareMatch AI - Synthetic Note Generator API")

# Define request schema
class GenerateRequest(BaseModel):
    disease: str = "Fabry Disease"
    summary: str

# Model path config
MODEL_PATH = "./fine_tuned_gpt2"
BASE_MODEL = "gpt2"

# Global model pointers
tokenizer = None
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

@app.on_event("startup")
def load_generator_model():
    """
    Loads fine-tuned weights on server startup. Falls back to base model if missing.
    """
    global tokenizer, model
    print(f"Server starting on device: {device}")
    
    if os.path.exists(MODEL_PATH) and any(f.endswith('.safetensors') or f.endswith('.bin') for f in os.listdir(MODEL_PATH)):
        print(f"Loading local fine-tuned weights from {MODEL_PATH}...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        model = AutoModelForCausalLM.from_pretrained(MODEL_PATH)
    else:
        print(f"Fine-tuned folder '{MODEL_PATH}' empty. Loading base '{BASE_MODEL}' model...")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
        model = AutoModelForCausalLM.from_pretrained(BASE_MODEL)
        
    model.to(device)
    model.eval()
    print("Model loaded and ready for API requests!")

@app.post("/generate")
def generate_note(payload: GenerateRequest):
    """
    Inference endpoint: takes structured summary and returns generated clinician notes.
    """
    global tokenizer, model
    if not model or not tokenizer:
        raise HTTPException(status_code=503, detail="Model is still loading.")
        
    prompt = (
        f"<|startoftext|>\n"
        f"DISEASE: {payload.disease}\n"
        f"SUMMARY: {payload.summary}\n"
        f"CLINICAL NOTE:\n"
    )
    
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=400,
                temperature=0.8,
                top_k=50,
                top_p=0.95,
                do_sample=True,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=tokenizer.eos_token_id
            )
            
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=False)
        
        # Clean text
        clean_note = generated_text
        if "CLINICAL NOTE:\n" in clean_note:
            clean_note = clean_note.split("CLINICAL NOTE:\n")[1]
        if "<|endoftext|>" in clean_note:
            clean_note = clean_note.split("<|endoftext|>")[0]
            
        return {
            "status": "success",
            "clinical_note": clean_note.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Host on all interfaces (0.0.0.0) so the main laptop can connect to Laptop 2
    uvicorn.run(app, host="0.0.0.0", port=8000)
