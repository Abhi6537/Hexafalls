import json
import torch
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModelForTokenClassification
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config
from dataset import NERDataset

def train_ner_locally():
    """
    Trains the BioBERT model locally on CPU/GPU. (Unit 2.3 - Local version)
    We keep epochs low (2 epochs) and batch size small (4) to ensure it runs quickly without freezing the system.
    """
    print("\n--- Starting BioBERT Local Training ---")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device selected: {device}")
    
    tokenizer = AutoTokenizer.from_pretrained(config.BIOBERT_MODEL)
    label_to_id = {label: idx for idx, label in enumerate(config.NER_LABELS)}
    
    # Load dataset
    data_path = config.TRAINING_DIR / "ner_training_data.json"
    dataset = NERDataset(data_path, tokenizer, label_to_id, max_len=config.NER_MAX_LEN)
    loader = DataLoader(dataset, batch_size=4, shuffle=True)
    
    # Load model
    print("Loading pre-trained BioBERT model...")
    model = AutoModelForTokenClassification.from_pretrained(config.BIOBERT_MODEL, num_labels=len(config.NER_LABELS))
    model.to(device)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=config.NER_LR)
    
    print("Beginning fine-tuning (2 epochs)...")
    model.train()
    
    for epoch in range(2):
        total_loss = 0
        for step, batch in enumerate(loader):
            optimizer.zero_grad()
            
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            if step % 5 == 0:
                print(f"Epoch {epoch+1}/2 | Step {step}/{len(loader)} | Loss: {loss.item():.4f}")
                
        print(f"Epoch {epoch+1} Completed. Avg Loss: {total_loss/len(loader):.4f}")
        
    # Save the model
    print(f"Saving fine-tuned model parameters to {config.NER_MODEL_DIR}...")
    model.save_pretrained(config.NER_MODEL_DIR)
    tokenizer.save_pretrained(config.NER_MODEL_DIR)
    print("Model saved successfully!")

if __name__ == "__main__":
    train_ner_locally()
