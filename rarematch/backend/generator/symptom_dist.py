import random
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

# Define HPO symptoms and real symptom distributions for Fabry Disease (from Orphanet/HPO)
FABRY_DISTRIBUTION = {
    # Phenotype: (HPO Code, Probability of presenting in a classic Fabry patient)
    "neuropathic_pain": ("HP:0001903", 0.80), # Burning extremity pain
    "angiokeratoma": ("HP:0001014", 0.65),     # Red-purple skin papules
    "corneal_opacity": ("HP:0001131", 0.70),   # Corneal verticillata (whorl-like)
    "hypohidrosis": ("HP:0000966", 0.75),      # Decreased sweating
    "renal_impairment": ("HP:0012211", 0.50),  # Proteinuria / decreased eGFR
    "left_ventricular_hypertrophy": ("HP:0001712", 0.40), # Cardiac thickening
    "proteinuria": ("HP:0000093", 0.60)        # Protein in urine
}

def generate_patient_distribution(patient_id):
    """
    Simulates symptom sampling based on real-world Fabry phenotype probabilities (Unit 1.1)
    """
    profile = {
        "patient_id": patient_id,
        "age": random.randint(18, 65),
        "sex": random.choice(["Male", "Female"]),
        "genetic_status": "GLA mutation positive", # Diagnostic criteria
        "phenotypes": [],
        "hpo_codes": [],
        "labs": {},
        "medications": []
    }
    
    # Draw symptoms probabilistically ("bag of marbles")
    for symptom, (hpo_code, prob) in FABRY_DISTRIBUTION.items():
        if random.random() < prob:
            profile["phenotypes"].append(symptom.replace("_", " "))
            profile["hpo_codes"].append(hpo_code)
            
    # Correlate lab values with drawn renal phenotypes
    if "renal impairment" in profile["phenotypes"]:
        profile["labs"]["eGFR"] = round(random.uniform(15.0, 44.0), 1) # Impaired renal function
        profile["labs"]["creatinine"] = round(random.uniform(1.6, 3.2), 2)
    else:
        profile["labs"]["eGFR"] = round(random.uniform(70.0, 110.0), 1) # Normal renal function
        profile["labs"]["creatinine"] = round(random.uniform(0.7, 1.2), 2)
        
    # Correlate therapies (enzyme replacement therapy)
    if random.random() < 0.85: # 85% of diagnosed patients are on ERT
        profile["medications"].append("agalsidase beta")
        profile["ert_duration_months"] = random.randint(3, 36)
    else:
        profile["ert_duration_months"] = 0
        
    return profile

if __name__ == "__main__":
    # Test generation of 1 profile (Unit 1.1 verification)
    sample_profile = generate_patient_distribution("PAT-TEST-1")
    print("Generated Structured Symptom Profile (Unit 1.1):")
    print(json.dumps(sample_profile, indent=2))
