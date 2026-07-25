import json
import torch
from torch.utils.data import Dataset
from transformers import AutoTokenizer
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

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
        
        # Convert tokens to input_ids and align labels
        input_ids = []
        label_ids = []
        
        # Add [CLS]
        input_ids.append(self.tokenizer.cls_token_id)
        label_ids.append(-100) # Ignore index for loss
        
        for token, label in zip(tokens, labels):
            sub_tokens = self.tokenizer.tokenize(token)
            if not sub_tokens:
                continue
            
            # Tokenize subwords (like "Fabry" -> "Fa", "##bry")
            sub_ids = self.tokenizer.convert_tokens_to_ids(sub_tokens)
            
            # Add first subword token with the real label
            input_ids.append(sub_ids[0])
            label_ids.append(self.label_to_id.get(label, 0))
            
            # Add subsequent subwords with ignore index (-100) to avoid double counting loss
            for sub_id in sub_ids[1:]:
                input_ids.append(sub_id)
                label_ids.append(-100)
                
        # Add [SEP]
        input_ids.append(self.tokenizer.sep_token_id)
        label_ids.append(-100)
        
        # Truncate if longer than max_len
        if len(input_ids) > self.max_len:
            input_ids = input_ids[:self.max_len]
            label_ids = label_ids[:self.max_len]
            
        # Pad
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

if __name__ == "__main__":
    tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-v1.1")
    label_to_id = {label: idx for idx, label in enumerate(config.NER_LABELS)}
    
    # Verify dataset works
    dataset = NERDataset(config.TRAINING_DIR / "ner_training_data.json", tokenizer, label_to_id)
    print(f"Dataset loaded. Number of training sentences: {len(dataset)}")
    
    sample = dataset[0]
    print("Token IDs shape:", sample["input_ids"].shape)
    print("Attention Mask shape:", sample["attention_mask"].shape)
    print("Label IDs shape:", sample["labels"].shape)
    print("Verification completed successfully for Task 2.2!")
