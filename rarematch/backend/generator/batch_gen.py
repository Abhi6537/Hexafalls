import json
import os
import sys
from symptom_dist import generate_patient_distribution

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def batch_generate_structured_twins(count=50):
    """
    Generates a batch of structured patient twin records (JSON format) using probabilistic sampling. (Unit 1.2)
    """
    print(f"Generating {count} structured patient profiles based on HPO distribution...")
    patient_twins = []
    
    for idx in range(count):
        patient_id = f"PAT-TWIN-{idx+1:03d}"
        twin = generate_patient_distribution(patient_id)
        patient_twins.append(twin)
        
    output_path = config.TRAINING_DIR / "structured_patient_twins.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(patient_twins, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved structured patient profiles to {output_path}")
    return patient_twins

if __name__ == "__main__":
    twins = batch_generate_structured_twins(count=50)
    print(f"Verified: Generated {len(twins)} profiles. First ID: {twins[0]['patient_id']}")
