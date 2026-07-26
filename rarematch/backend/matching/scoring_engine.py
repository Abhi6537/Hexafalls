import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

# Import specialized matchers
from numeric_matcher import evaluate_numeric_criterion
from temporal_matcher import evaluate_temporal_criterion
from categorical_matcher import evaluate_categorical_criterion
from semantic_matcher import evaluate_semantic_criterion

def score_patient_against_trial(patient_profile, trial_criteria_list):
    """
    Computes a hybrid match score and lists criterion status for a patient profile. (Unit 4.5)
    """
    results = {
        "trial_nct_id": trial_criteria_list.get("nctId"),
        "trial_title": trial_criteria_list.get("title"),
        "match_percentage": 0.0,
        "eligibility_status": "PENDING",
        "criteria_results": []
    }
    
    total_criteria = 0
    passed_criteria = 0
    failed_criteria = 0
    uncertain_criteria = 0
    
    # Extract structured patient details
    patient_labs = patient_profile.get("labs", {})
    patient_age = patient_profile.get("age", 30)
    ert_duration = patient_profile.get("ert_duration_months", 0)
    patient_phenotypes = patient_profile.get("phenotypes", [])
    
    # Connect and classify RAG server criteria
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../generator")))
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../trial_rag")))
    from symptom_dist import generate_patient_distribution # For reference structure
    from build_vector_store import classify_criterion_type
    
    # Process inclusion and exclusion
    def evaluate_block(criteria_list, is_exclusion=False):
        nonlocal passed_criteria, failed_criteria, uncertain_criteria, total_criteria
        for crit in criteria_list:
            total_criteria += 1
            
            # Predict evaluation category type
            crit_type = classify_criterion_type(crit)
            
            status = None
            evidence = "Evaluated via semantic similarity check."
            score = 1.0
            
            # Route evaluation based on category
            if crit_type == "NUMERIC":
                status, evidence = evaluate_numeric_criterion(crit, patient_profile, None)
            elif crit_type == "TEMPORAL":
                status, evidence = evaluate_temporal_criterion(crit, ert_duration)
            elif crit_type == "CATEGORICAL":
                status, evidence = evaluate_categorical_criterion(crit, patient_profile)
            elif crit_type == "QUALITATIVE":
                passed, score, matched_sym = evaluate_semantic_criterion(crit, patient_phenotypes, threshold=0.70)
                status = passed
                evidence = f"Matched against symptom '{matched_sym}' (Similarity: {score:.1%})"
                
            # If a structured rule failed to parse, mark as uncertain/unresolved instead of running semantic mismatch
            if status is None:
                if crit_type in ["NUMERIC", "TEMPORAL", "CATEGORICAL"]:
                    status = None
                    evidence = "Structured clinical rule parameter unresolved. Requires doctor chart verification."
                else:
                    status = False
                    evidence = "No matching clinical symptoms identified."
                
            # Adjust logical checks for exclusion criteria
            if is_exclusion:
                if status is True:
                    final_status = "FAIL"
                elif status is False:
                    final_status = "PASS"
                else:
                    final_status = "UNCERTAIN"
            else:
                if status is True:
                    final_status = "PASS"
                elif status is False:
                    final_status = "FAIL"
                else:
                    final_status = "UNCERTAIN"
                
            if final_status == "PASS":
                passed_criteria += 1
            elif final_status == "FAIL":
                failed_criteria += 1
            else:
                uncertain_criteria += 1
                
            results["criteria_results"].append({
                "criterion_text": crit,
                "type": crit_type,
                "category": "exclusion" if is_exclusion else "inclusion",
                "status": final_status,
                "evidence": evidence,
                "similarity_score": score
            })
            
    evaluate_block(trial_criteria_list.get("inclusion_criteria", []), is_exclusion=False)
    evaluate_block(trial_criteria_list.get("exclusion_criteria", []), is_exclusion=True)
    
    # Calculate match percentage
    if total_criteria > 0:
        match_score = (passed_criteria / total_criteria) * 100.0
        results["match_percentage"] = round(match_score, 1)
        
    # Determine eligibility recommendation
    if failed_criteria > 0:
        results["eligibility_status"] = "INELIGIBLE"
    elif uncertain_criteria > 0:
        results["eligibility_status"] = "UNCERTAIN (requires manual review)"
    else:
        results["eligibility_status"] = "ELIGIBLE"
        
    return results

if __name__ == "__main__":
    # Test scoring engine pipeline (Unit 4.6)
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../generator")))
    from symptom_dist import generate_patient_distribution
    
    # Generate test patient twin
    patient = generate_patient_distribution("PAT-TEST-4")
    
    # Labeled trial
    test_trial = {
        "nctId": "NCT04999866",
        "title": "A Clinical Trial to Evaluate Migalastat",
        "inclusion_criteria": [
            "Male or female aged 18 years or older.",
            "eGFR >= 30 mL/min/1.73 m2.",
            "On stable enzyme replacement therapy (ERT) for at least 12 months."
        ],
        "exclusion_criteria": [
            "History of kidney transplantation or currently receiving dialysis.",
            "Pregnant or breastfeeding female."
        ]
    }
    
    match_report = score_patient_against_trial(patient, test_trial)
    print("\n--- Matching Engine Report (Units 4.5 & 4.6) ---")
    print(f"Patient ID: {patient['patient_id']} | Sex: {patient['sex']} | Age: {patient['age']} | ERT: {patient['ert_duration_months']} months")
    print(f"Trial: {match_report['trial_nct_id']} - {match_report['trial_title']}")
    print(f"Match Score: {match_report['match_percentage']}% | Recommendation: {match_report['eligibility_status']}")
    print("\nCriterion Breakdown:")
    for idx, c in enumerate(match_report["criteria_results"]):
        print(f" {idx+1}. [{c['status']}] [{c['category'].upper()}] ({c['type']})")
        print(f"    Crit: \"{c['criterion_text']}\"")
        print(f"    Evid: {c['evidence']}")
