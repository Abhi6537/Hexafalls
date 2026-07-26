import re

def evaluate_categorical_criterion(criterion_text, patient_profile):
    """
    Checks discrete categorical requirements (e.g. sex constraints, genetic GLA status, 
    dialysis history, pregnancy status) against patient data. (Unit 4.3)
    Returns: (status: bool/None, evidence: str)
    """
    text_lower = criterion_text.lower()
    
    # 1. Sex / Gender constraints
    if "male" in text_lower or "female" in text_lower:
        p_sex = (patient_profile.get("sex") or "").lower()
        if "male or female" in text_lower or "both sexes" in text_lower:
            return True, f"Both sexes eligible. Patient sex: {patient_profile.get('sex') or 'Unknown'}"
        elif "female" in text_lower and "male" not in text_lower:
            passed = p_sex == "female"
            return passed, f"Female patients only. Patient sex: {patient_profile.get('sex') or 'Unknown'}"
        elif "male" in text_lower and "female" not in text_lower:
            passed = p_sex == "male"
            return passed, f"Male patients only. Patient sex: {patient_profile.get('sex') or 'Unknown'}"
            
    # 2. Genetic GLA mutation validation
    if "gla" in text_lower or "mutation" in text_lower or "genetic" in text_lower:
        genetic_status = (patient_profile.get("genetic_mutation") or patient_profile.get("genetic_status") or "")
        if "positive" in genetic_status.lower() or "confirmed" in genetic_status.lower() or "c." in genetic_status.lower() or "gla" in genetic_status.lower():
            return True, f"Genetic mutation confirmed: {genetic_status}"
        else:
            return False, "Patient profile does not verify required mutation."
            
    # 2b. Dialysis and Transplant history check
    if "dialysis" in text_lower or "transplant" in text_lower:
        transplants = (patient_profile.get("transplant_history") or "").lower()
        if "dialysis" in text_lower and "dialysis" in transplants:
            return True, "Patient is currently receiving dialysis (exclusion met)"
        if "transplant" in text_lower and ("transplant" in transplants):
            return True, "Patient has history of transplantation (exclusion met)"
        return False, "Patient has no history of dialysis or transplantation"
            
    # 3. Pregnancy exclusion check
    if "pregnan" in text_lower or "breastfeeding" in text_lower:
        preg_status = (patient_profile.get("pregnancy_status") or "").lower()
        if (patient_profile.get("sex") or "").lower() == "male":
            return False, "Patient is Male (pregnancy exclusion not met)"
        elif "pregnant" in preg_status or "yes" in preg_status:
            return True, "Patient is currently pregnant/breastfeeding (exclusion met)"
        elif "no" in preg_status or "not" in preg_status:
            return False, "Patient is not pregnant/breastfeeding (exclusion not met)"
        else:
            return None, "Female pregnancy/breastfeeding status requires manual record verification."
            
    return None, "Categorical condition did not match structured parser patterns."
