from transformers import pipeline
import uuid

class NERAgent:
    """
    Named Entity Recognition Agent.
    Uses d4data/biomedical-ner-all to extract diseases and symptoms from free text.
    """
    def __init__(self):
        print("NER Agent: Loading HuggingFace model 'd4data/biomedical-ner-all' (this may take a moment)...")
        self.ner_pipeline = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

    def process_document(self, text: str):
        """
        Parses clinical text into structured patient profile.
        """
        print(f"NER Agent: Extracting entities from {len(text)} characters of text...")
        entities = self.ner_pipeline(text)
        
        disease = "Unknown Disease"
        symptoms = set()
        age = 45
        sex = "Male"
        
        disease_tokens = []
        
        # d4data/biomedical-ner-all labels:
        # Disease_disorder, Sign_symptom, Age, Sex, etc.
        for ent in entities:
            group = ent['entity_group']
            word = ent['word'].strip()
            
            if group == 'Disease_disorder':
                if word.startswith("##"):
                    if disease_tokens:
                        disease_tokens[-1] += word[2:]
                else:
                    disease_tokens.append(word)
            elif group == 'Sign_symptom':
                symptoms.add(word.lower())
            elif group == 'Age':
                try:
                    digits = ''.join(filter(str.isdigit, word))
                    if digits:
                        age = int(digits)
                except:
                    pass
            elif group == 'Sex':
                if 'fem' in word.lower() or 'woman' in word.lower():
                    sex = "Female"
                elif 'male' in word.lower() or 'man' in word.lower() or 'boy' in word.lower():
                    sex = "Male"
                    
        if disease_tokens:
            disease = " ".join(disease_tokens).title()
                    
        return {
            "patient_id": f"PAT-{str(uuid.uuid4().int)[:4]}",
            "age": age,
            "sex": sex,
            "disease": disease,
            "phenotypes": list(symptoms) if symptoms else ["unknown phenotype"],
            "weight_kg": 72,
            "bmi": 24.5,
            "blood_group": "O+",
            "genetic_mutation": "Pending Lab",
            "kidney_egfr": "90 mL/min",
            "liver_alt": "25 U/L",
            "heart_rate": "72 bpm"
        }
