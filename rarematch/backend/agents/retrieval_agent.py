import chromadb
from sentence_transformers import SentenceTransformer
import json
import os
import sys
import requests
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

class RetrievalAgent:
    """
    Retrieves candidate clinical trials dynamically from ClinicalTrials.gov API.
    """
    def __init__(self):
        print("Retrieval Agent: Initialized (Dynamic API Mode).")
        
    def retrieve_candidate_trials(self, patient_profile, limit=3):
        """
        Fetches active trials for the extracted disease from ClinicalTrials.gov API.
        """
        disease = patient_profile.get("disease", "") if isinstance(patient_profile, dict) else (patient_profile[0] if patient_profile else "")
        if not disease or disease.lower() == "unknown disease":
            print("Retrieval Agent: No specific disease identified in profile. Falling back to Fabry Disease.")
            disease = "Fabry Disease"
            
        print(f"Retrieval Agent: Fetching real trials for '{disease}' from ClinicalTrials.gov...")
        
        # Call the ClinicalTrials.gov API (v2)
        api_url = f"https://clinicaltrials.gov/api/v2/studies"
        params = {
            "query.cond": disease,
            "filter.overallStatus": "RECRUITING",
            "pageSize": limit
        }
        
        candidates = []
        try:
            response = requests.get(api_url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                studies = data.get("studies", [])
                
                for study in studies:
                    protocol = study.get("protocolSection", {})
                    ident = protocol.get("identificationModule", {})
                    eligibility = protocol.get("eligibilityModule", {})
                    
                    nct_id = ident.get("nctId", "Unknown")
                    title = ident.get("briefTitle", "No Title")
                    criteria_text = eligibility.get("eligibilityCriteria", "")
                    
                    # Simple heuristic parser for criteria text
                    inclusion = []
                    exclusion = []
                    
                    # Split by "Exclusion Criteria:"
                    parts = re.split(r"Exclusion Criteria:", criteria_text, flags=re.IGNORECASE)
                    inc_text = parts[0]
                    exc_text = parts[1] if len(parts) > 1 else ""
                    
                    # Split by newlines or dashes
                    for line in inc_text.split('\n'):
                        line = line.strip().strip('-* ')
                        if len(line) > 10 and "Inclusion Criteria:" not in line:
                            inclusion.append(line)
                            
                    for line in exc_text.split('\n'):
                        line = line.strip().strip('-* ')
                        if len(line) > 10:
                            exclusion.append(line)
                            
                    candidates.append({
                        "nctId": nct_id,
                        "title": title,
                        "inclusion_criteria": inclusion,
                        "exclusion_criteria": exclusion
                    })
                    
            print(f"Retrieval Agent: Successfully downloaded and parsed {len(candidates)} real trials!")
        except Exception as e:
            print(f"Retrieval Agent Error fetching trials: {e}")
            
        print(f"Retrieval Agent: Identified {len(candidates)} candidate trials for evaluation.")
        return candidates

if __name__ == "__main__":
    agent = RetrievalAgent()
    candidates = agent.retrieve_candidate_trials({"disease": "Fabry disease"})
    for t in candidates:
        print(f" - {t['nctId']}: {t['title']}")
