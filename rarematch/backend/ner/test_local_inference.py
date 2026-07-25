import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def run_local_ner_inference(text):
    """
    Loads our fine-tuned local BioBERT model parameters from disk (Module 2)
    and extracts medical entities from a clinician note. (Unit 2.5)
    """
    model_path = config.NER_MODEL_DIR
    
    # Label dictionary mapping
    label_to_id = {label: idx for idx, label in enumerate(config.NER_LABELS)}
    id_to_label = {idx: label for idx, label in enumerate(config.NER_LABELS)}
    
    print(f"Loading local fine-tuned BioBERT model from {model_path}...")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForTokenClassification.from_pretrained(model_path)
    model.eval()
    
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]
    
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=-1)[0].numpy()
        
    extracted_entities = []
    current_entity = []
    current_label = None
    
    for idx, (token_id, pred_id) in enumerate(zip(input_ids[0].numpy(), predictions)):
        token = tokenizer.convert_ids_to_tokens(int(token_id))
        if token in ["[CLS]", "[SEP]", "[PAD]"]:
            continue
            
        label = id_to_label[pred_id]
        is_subword = token.startswith("##")
        clean_token = token.replace("##", "")
        
        # Determine if this token continues the current active entity
        if label != "O":
            entity_type = label.split("-")[1]
            # It continues if:
            # 1. It's a subword (which is part of the previous word)
            # 2. It has an "I-" label matching the active type
            # 3. Or it has a "B-" label but the active type is identical and it immediately follows the previous token (subword boundary artifact)
            if current_entity and (is_subword or label.startswith("I-") or (label.startswith("B-") and current_label == entity_type)):
                if is_subword:
                    current_entity.append(clean_token)
                else:
                    current_entity.append(" " + clean_token)
            else:
                # Close the previous entity
                if current_entity:
                    extracted_entities.append({
                        "entity": "".join(current_entity).strip(),
                        "type": current_label
                    })
                # Start a new entity
                current_entity = [clean_token]
                current_label = entity_type
        else:
            # Token is 'O' - close any active entity
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
            
    return categorized

if __name__ == "__main__":
    test_note = "A 34-year-old male with classic Fabry disease who presented with neuropathic pain. Currently on agalsidase beta."
    entities = run_local_ner_inference(test_note)
    print("\n--- Extracted Clinical Entities (Local BioBERT Model) ---")
    import json
    print(json.dumps(entities, indent=2))
