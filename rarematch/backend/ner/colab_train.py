# --- RareMatch AI - BioBERT Fine-Tuning & Colab API Server with Ngrok ---
# Copy-paste this entire script into Google Colab, set up your GPU, and run it!

# 1. Install dependencies
!pip install transformers datasets accelerate fastapi uvicorn pyngrok nest-asyncio seqeval evaluate --quiet

# 2. Imports
import json
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import AutoTokenizer, AutoModelForTokenClassification
from datasets import load_dataset
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import nest_asyncio
from pyngrok import ngrok
import evaluate
import numpy as np

# 3. Setup configurations & tokenizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "dmis-lab/biobert-v1.1"

# Labeled medical classes we extract
NER_LABELS = [
    "O", "B-DISEASE", "I-DISEASE", "B-MEDICATION", "I-MEDICATION",
    "B-LAB", "I-LAB", "B-SYMPTOM", "I-SYMPTOM", "B-DOSAGE", "I-DOSAGE",
    "B-DURATION", "I-DURATION", "B-NEGATION", "I-NEGATION"
]
label_to_id = {label: idx for idx, label in enumerate(NER_LABELS)}
id_to_label = {idx: label for idx, label in enumerate(NER_LABELS)}

tokenizer = AutoTokenizer.from_pretrained(model_name)

# 4. Define dataset class for tokenizer token alignment
class NERDataset(Dataset):
    def __init__(self, data_path, tokenizer, label_to_id, max_len=512):
        with open(data_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)
        self.tokenizer = tokenizer
        self.label_to_id = label_to_id
        self.max_len = max_len

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        tokens = item["tokens"]
        labels = item["labels"]
        
        input_ids = []
        label_ids = []
        
        input_ids.append(self.tokenizer.cls_token_id)
        label_ids.append(-100)
        
        for token, label in zip(tokens, labels):
            sub_tokens = self.tokenizer.tokenize(token)
            if not sub_tokens:
                continue
            sub_ids = self.tokenizer.convert_tokens_to_ids(sub_tokens)
            
            input_ids.append(sub_ids[0])
            label_ids.append(self.label_to_id.get(label, 0))
            
            for sub_id in sub_ids[1:]:
                input_ids.append(sub_id)
                label_ids.append(-100)
                
        input_ids.append(self.tokenizer.sep_token_id)
        label_ids.append(-100)
        
        if len(input_ids) > self.max_len:
            input_ids = input_ids[:self.max_len]
            label_ids = label_ids[:self.max_len]
            
        attention_mask = [1] * len(input_ids)
        padding_len = self.max_len - len(input_ids)
        
        input_ids.extend([self.tokenizer.pad_token_id] * padding_len)
        label_ids.extend([-100] * padding_len)
        attention_mask.extend([0] * padding_len)
        
        return {
            "input_ids": torch.tensor(input_ids, dtype=torch.long),
            "attention_mask": torch.tensor(attention_mask, dtype=torch.long),
            "labels": torch.tensor(label_ids, dtype=torch.long)
        }

# Load dataset (make sure you upload 'ner_training_data.json' first!)
if not os.path.exists("ner_training_data.json"):
    # Generate backup seed data
    training_data = [
        {
            "tokens": ["The", "patient", "is", "a", "45-year-old", "male", "diagnosed", "with", "classic", "Fabry", "disease", "who", "presented", "with", "neuropathic", "pain", "in", "hands", "and", "feet", "."],
            "labels": ["O", "O", "O", "O", "O", "O", "O", "O", "B-DISEASE", "I-DISEASE", "I-DISEASE", "O", "O", "O", "B-SYMPTOM", "I-SYMPTOM", "O", "B-SYMPTOM", "O", "B-SYMPTOM", "O"]
        }
    ] * 100
    with open("ner_training_data.json", "w", encoding="utf-8") as f:
        json.dump(training_data, f, indent=2)

dataset = NERDataset("ner_training_data.json", tokenizer, label_to_id)

# Split into train (90%) and validation (10%)
train_size = int(0.9 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False)

# Load evaluation metric
metric = evaluate.load("seqeval")

# Load BioBERT model
model = AutoModelForTokenClassification.from_pretrained(model_name, num_labels=len(NER_LABELS))
model.to(device)

optimizer = torch.optim.AdamW(model.parameters(), lr=2e-5)

# 5. Fine-Tuning
print("\nStarting BioBERT Clinical NER Fine-tuning with Evaluation...")
for epoch in range(3):
    model.train()
    total_loss = 0
    for step, batch in enumerate(train_loader):
        optimizer.zero_grad()
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)
        
        outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
        
    avg_train_loss = total_loss / len(train_loader)
    
    # Validation Loop
    model.eval()
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        for batch in val_loader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            predictions = torch.argmax(outputs.logits, dim=-1)
            
            # Convert tensors to lists for seqeval, ignoring -100 padding
            for i in range(labels.shape[0]):
                true_labels = [id_to_label[l.item()] for l in labels[i] if l.item() != -100]
                preds = [id_to_label[p.item()] for p, l in zip(predictions[i], labels[i]) if l.item() != -100]
                
                all_labels.append(true_labels)
                all_predictions.append(preds)
                
    results = metric.compute(predictions=all_predictions, references=all_labels)
    f1_score = results["overall_f1"]
    precision = results["overall_precision"]
    recall = results["overall_recall"]
    
    print(f"Epoch {epoch+1}/3 | Train Loss: {avg_train_loss:.4f} | Val F1: {f1_score:.4f} | Val Precision: {precision:.4f} | Val Recall: {recall:.4f}")

# Save fine-tuned weights
print("\nSaving fine-tuned BioBERT weights...")
model.save_pretrained("./fine_tuned_biobert")
tokenizer.save_pretrained("./fine_tuned_biobert")

# ──────────────────────────────────────────────────────────────────────────────
# 6. Colab API Server Setup (BioBERT Extraction Endpoint)
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="RareMatch AI - BioBERT NER API")

class ExtractRequest(BaseModel):
    text: str

@app.post("/extract")
def extract_entities(payload: ExtractRequest):
    """
    Parses clinician note text, runs BioBERT NER inference, 
    and returns parsed, formatted lists of medical entities.
    """
    inputs = tokenizer(payload.text, return_tensors="pt", truncation=True, max_length=512)
    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)
    
    model.eval()
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=-1)[0].cpu().numpy()
        
    tokens = tokenizer.convert_ids_to_tokens(input_ids[0])
    
    extracted_entities = []
    current_entity = []
    current_label = None
    
    # Process entities from sub-word tokens
    for token, pred_id in zip(tokens, predictions):
        if token in ["[CLS]", "[SEP]", "[PAD]"]:
            continue
            
        label = id_to_label[pred_id]
        
        # Clean subword hashing characters
        clean_token = token.replace("##", "") if token.startswith("##") else " " + token
        
        if label.startswith("B-"):
            if current_entity:
                extracted_entities.append({
                    "entity": "".join(current_entity).strip(),
                    "type": current_label
                })
            current_entity = [clean_token]
            current_label = label.split("-")[1]
        elif label.startswith("I-") and current_label == label.split("-")[1]:
            current_entity.append(clean_token)
        else:
            if current_entity:
                extracted_entities.append({
                    "entity": "".join(current_entity).strip(),
                    "type": current_label
                })
                current_entity = []
                current_label = None
                
    if current_entity:
        extracted_entities.append({
            "entity": "".join(current_entity).strip(),
            "type": current_label
        })
        
    # Group entities by category
    categorized = {
        "diseases": [],
        "medications": [],
        "labs": [],
        "symptoms": [],
        "negations": [],
        "durations": [],
        "dosages": []
    }
    
    for ent in extracted_entities:
        category = ent["type"].lower() + "s"
        if category in categorized:
            categorized[category].append(ent["entity"])
            
    return {"status": "success", "entities": categorized}

# ──────────────────────────────────────────────────────────────────────────────
# 7. Expose Colab Port to Internet via Ngrok Tunnel
# ──────────────────────────────────────────────────────────────────────────────

NGROK_TOKEN = "YOUR_NGROK_TOKEN_HERE"

if NGROK_TOKEN == "YOUR_NGROK_AUTHTOKEN":
    print("\n⚠️ ERROR: You must set your NGROK_TOKEN in the script to expose the API!")
else:
    ngrok.set_auth_token(NGROK_TOKEN)
    public_url = ngrok.connect(8001) # Use port 8001 to avoid conflict with GPT-2 server
    print("\n🚀 BIOBERT NER API IS ONLINE!")
    print(f"👉 Copy this URL: {public_url.public_url}")
    print("👉 Update config.py on Laptop 1.")
    
    import asyncio
    nest_asyncio.apply()
    
    config = uvicorn.Config(app=app, host="0.0.0.0", port=8001, loop="asyncio")
    server = uvicorn.Server(config)
    loop = asyncio.get_event_loop()
    loop.create_task(server.serve())
