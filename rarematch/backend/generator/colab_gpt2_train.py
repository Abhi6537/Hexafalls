# --- RareMatch AI - GPT-2 Fine-Tuning & Colab API Server with Ngrok ---
# Copy-paste this entire script into Google Colab, set up your GPU, and run it!

# 1. Install dependencies
!pip install transformers datasets accelerate fastapi uvicorn pyngrok nest-asyncio --quiet

# 2. Imports
import json
import torch
from torch.utils.data import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, Trainer, TrainingArguments
from datasets import load_dataset
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import nest_asyncio
from pyngrok import ngrok
import math

# 3. Setup configurations & tokenizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# Load dataset (make sure you upload 'gpt2_training_text.txt' to Colab first!)
if not os.path.exists("gpt2_training_text.txt"):
    with open("gpt2_training_text.txt", "w") as f:
        f.write("<|startoftext|>\nDISEASE: Fabry Disease\nCLINICAL NOTE:\n34F presents with neuropathic pain.\n<|endoftext|>\n" * 50)

def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, max_length=512)

dataset = load_dataset("text", data_files={"train": "gpt2_training_text.txt"})
dataset = dataset["train"].train_test_split(test_size=0.1)

tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["text"])

from transformers import DataCollatorForLanguageModeling
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Load base model
model = AutoModelForCausalLM.from_pretrained(model_name)
model.to(device)

# 4. Training Arguments
training_args = TrainingArguments(
    output_dir="./gpt2_patient_twin",
    num_train_epochs=5,
    per_device_train_batch_size=4,
    save_total_limit=1,
    prediction_loss_only=True,
    learning_rate=5e-5,
    weight_decay=0.01,
    logging_steps=10,
    eval_strategy="epoch",  # Evaluate at end of each epoch
    fp16=torch.cuda.is_available()
)

trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["test"]
)

# Run Training
print("\nStarting GPT-2 Fine-tuning with Evaluation...")
trainer.train()

# Run Final Evaluation
print("\nRunning Final Evaluation to calculate Perplexity...")
eval_results = trainer.evaluate()
try:
    perplexity = math.exp(eval_results["eval_loss"])
except OverflowError:
    perplexity = float("inf")
    
print(f"\n✅ Training Complete!")
print(f"📊 Final Evaluation Loss: {eval_results['eval_loss']:.4f}")
print(f"📊 Final Perplexity: {perplexity:.4f}")

# Save fine-tuned weights
trainer.save_model("./gpt2_patient_twin")
tokenizer.save_pretrained("./gpt2_patient_twin")
print("Model fine-tuned and saved successfully!")

# ──────────────────────────────────────────────────────────────────────────────
# 5. Colab API Server Setup
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="RareMatch AI - Colab GPU API")

class GenerateRequest(BaseModel):
    disease: str = "Fabry Disease"
    summary: str

@app.post("/generate")
def generate_note(payload: GenerateRequest):
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
        clean_note = generated_text
        if "CLINICAL NOTE:\n" in clean_note:
            clean_note = clean_note.split("CLINICAL NOTE:\n")[1]
        if "<|endoftext|>" in clean_note:
            clean_note = clean_note.split("<|endoftext|>")[0]
            
        return {"status": "success", "clinical_note": clean_note.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ──────────────────────────────────────────────────────────────────────────────
# 6. Expose Colab Port to Internet via Ngrok Tunnel
# ──────────────────────────────────────────────────────────────────────────────

# PASTE YOUR NGROK AUTHTOKEN HERE!
NGROK_TOKEN = "YOUR_NGROK_TOKEN_HERE"

if NGROK_TOKEN == "YOUR_NGROK_AUTHTOKEN":
    print("\n⚠️ ERROR: You must set your NGROK_TOKEN in the script to expose the API!")
else:
    # Configure ngrok token
    ngrok.set_auth_token(NGROK_TOKEN)
    
    # Open a tunnel on port 8000
    public_url = ngrok.connect(8000)
    print("\n🚀 COLA GPU API IS ONLINE!")
    print(f"👉 Copy this URL: {public_url.public_url}")
    print("👉 Paste it as your LAPTOP_2_API_URL in config.py on your main laptop.")
    
    # Start the server (nest-asyncio allows uvicorn to run inside Colab)
    import asyncio
    nest_asyncio.apply()
    
    config = uvicorn.Config(app=app, host="0.0.0.0", port=8000, loop="asyncio")
    server = uvicorn.Server(config)
    loop = asyncio.get_event_loop()
    loop.create_task(server.serve())
