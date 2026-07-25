# --- RareMatch AI - Colab Notebook Data Generation ---
# Run this cell to generate the training data we need.

import json

training_data = [
    {
        "tokens": ["The", "patient", "is", "a", "45-year-old", "male", "diagnosed", "with", "classic", "Fabry", "disease", "who", "presented", "with", "neuropathic", "pain", "in", "hands", "and", "feet", "."],
        "labels": ["O", "O", "O", "O", "O", "O", "O", "O", "B-DISEASE", "I-DISEASE", "I-DISEASE", "O", "O", "O", "B-SYMPTOM", "I-SYMPTOM", "O", "B-SYMPTOM", "O", "B-SYMPTOM", "O"]
    },
    {
        "tokens": ["He", "has", "been", "on", "Enzyme", "Replacement", "Therapy", "with", "agalsidase", "beta", "for", "18", "months", "."],
        "labels": ["O", "O", "O", "O", "B-MEDICATION", "I-MEDICATION", "I-MEDICATION", "O", "B-MEDICATION", "I-MEDICATION", "O", "B-DURATION", "I-DURATION", "O"]
    },
    {
        "tokens": ["Last", "blood", "work", "showed", "eGFR", "of", "45", "mL/min", "with", "no", "history", "of", "stroke", "or", "kidney", "transplant", "."],
        "labels": ["O", "O", "O", "O", "B-LAB", "O", "B-DOSAGE", "I-DOSAGE", "O", "B-NEGATION", "I-NEGATION", "I-NEGATION", "I-NEGATION", "O", "O", "O", "O"]
    },
    {
        "tokens": ["The", "patient", "reports", "joint", "pain", "and", "chronic", "fatigue", "."],
        "labels": ["O", "O", "O", "B-SYMPTOM", "I-SYMPTOM", "O", "B-SYMPTOM", "I-SYMPTOM", "O"]
    },
    {
        "tokens": ["She", "has", "no", "history", "of", "cardiac", "hypertrophy", "or", "arrhythmia", "."],
        "labels": ["O", "O", "B-NEGATION", "I-NEGATION", "I-NEGATION", "I-NEGATION", "I-NEGATION", "O", "O", "O"]
    }
]

expanded_data = []
for i in range(20):
    for item in training_data:
        expanded_data.append(item)

with open("ner_training_data.json", "w", encoding="utf-8") as f:
    json.dump(expanded_data, f, indent=2)

print(f"Generated {len(expanded_data)} training records to 'ner_training_data.json'!")
