import uuid
import re
from transformers import pipeline

class NERAgent:
    """
    Comprehensive Named Entity Recognition & Clinical Text Parsing Agent.
    Uses regex for structured clinical notes and d4data/biomedical-ner-all as a fallback for symptoms.
    """
    def __init__(self):
        print("NER Agent: Initializing Comprehensive Clinical Parser...")
        # Keep HF model for unstructured fallback
        print("NER Agent: Loading HuggingFace model 'd4data/biomedical-ner-all' (this may take a moment)...")
        self.ner_pipeline = pipeline("ner", model="d4data/biomedical-ner-all", aggregation_strategy="simple")

    def _extract_field(self, text, patterns):
        if isinstance(patterns, str):
            patterns = [patterns]
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return match.group(1).strip()
                except IndexError:
                    return match.group(0).strip()
        return None

    def process_document(self, text: str):
        print(f"NER Agent: Extracting comprehensive profile from {len(text)} characters of text...")
        
        # Parse fields using multiple regex patterns to support structured and unstructured formats
        profile = {
            "patient_id": f"PAT-{str(uuid.uuid4().int)[:4]}",
            # Vitals
            "age": self._extract_field(text, [r"Age:\s*(\d+)", r"(\d+)[- ]year[- ]old"]),
            "sex": self._extract_field(text, [r"Sex(?: at Birth)?:\s*(\w+)", r"\b(male|female|man|woman|boy|girl)\b"]),
            "weight": self._extract_field(text, [r"Weight:\s*(.*)", r"weight[^0-9]*(\d+(?:\.\d+)?\s*(?:kg|lbs))"]),
            "height": self._extract_field(text, r"Height:\s*(.*)"),
            "bmi": self._extract_field(text, r"BMI:\s*(.*)"),
            "pregnancy_status": self._extract_field(text, r"Pregnancy/?Lactation Status:\s*(.*)"),
            
            # Diagnosis
            "disease": self._extract_field(text, [r"(?:Official )?Disease(?: Name)?:\s*(.*)", r"(Fabry Disease|Gaucher Disease|Pompe Disease)"]),
            "diagnosis_date": self._extract_field(text, r"Date of Diagnosis:\s*(.*)"),
            "genetic_mutation": self._extract_field(text, [r"(?:Genetic )?Mutation(?: Code)?:\s*(.*)", r"c\.[\w>]+ \(p\.[\w]+\)"]),
            "family_history": self._extract_field(text, r"Family History:\s*(.*)"),
            
            # Symptoms
            "active_symptoms": self._extract_field(text, r"Active Symptoms:\s*(.*)"),
            "symptom_severity": self._extract_field(text, r"Symptom Severity/?Mobility:\s*(.*)"),
            "age_of_onset": self._extract_field(text, r"Age of Onset:\s*(.*)"),
            
            # Labs
            "egfr": self._extract_field(text, [r"Kidney(?: Function)? \(eGFR\):\s*(.*)", r"eGFR[^0-9]*(\d+(?:\.\d+)?)"]),
            "alt": self._extract_field(text, [r"Liver(?: Function)? \(ALT\):\s*(.*)", r"ALT[^0-9]*(\d+(?:\.\d+)?)"]),
            "ast": self._extract_field(text, [r"Liver(?: Function)? \(AST\):\s*(.*)", r"AST[^0-9]*(\d+(?:\.\d+)?)"]),
            "ejection_fraction": self._extract_field(text, r"Cardiac(?: Function)? \(Ejection Fraction\):\s*(.*)"),
            "blood_counts": self._extract_field(text, r"Blood Counts:\s*(.*)"),
            
            # History
            "ert_duration_months": int(self._extract_field(text, [r"ERT.*?(?:for)?\s*(\d+)\s*months", r"infusions.*?(?:for)?\s*(\d+)\s*months"]) or 0),
            "current_medications": self._extract_field(text, r"Current Medications:\s*(.*)"),
            "past_trials": self._extract_field(text, r"Past Experimental Trials:\s*(.*)"),
            "transplant_history": self._extract_field(text, r"Transplant History:\s*(.*)"),
            "comorbidities": self._extract_field(text, r"Comorbidities:\s*(.*)"),
            "surgeries": self._extract_field(text, r"Surgeries:\s*(.*)"),
            "disability_status": self._extract_field(text, r"Disability Status:\s*(.*)"),
            
            # Lifestyle
            "substance_history": self._extract_field(text, r"Substance History:\s*(.*)"),
            "allergies": self._extract_field(text, r"Allergies:\s*(.*)")
        }

        # Fallback to HuggingFace if disease is completely missing (unstructured text)
        if not profile["disease"]:
            entities = self.ner_pipeline(text)
            disease_tokens = []
            symptoms = set()
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
            
            if disease_tokens:
                profile["disease"] = " ".join(disease_tokens).title()
            else:
                profile["disease"] = "Unknown Disease"
                
            if symptoms and not profile["active_symptoms"]:
                profile["active_symptoms"] = ", ".join(symptoms)

        # Ensure phenotypes is always a list for the scoring engine qualitative matching
        if profile.get("active_symptoms"):
            profile["phenotypes"] = [s.strip() for s in profile["active_symptoms"].split(",")]
        else:
            profile["phenotypes"] = []

        return profile
