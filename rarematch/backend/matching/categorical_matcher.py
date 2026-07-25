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
        p_sex = patient_profile.get("sex", "").lower()
        if "male or female" in text_lower or "both sexes" in text_lower:
            return True, f"Both sexes eligible. Patient sex: {patient_profile.get('sex')}"
        elif "female" in text_lower and "male" not in text_lower:
            passed = p_sex == "female"
            return passed, f"Female patients only. Patient sex: {patient_profile.get('sex')}"
        elif "male" in text_lower and "female" not in text_lower:
            passed = p_sex == "male"
            return passed, f"Male patients only. Patient sex: {patient_profile.get('sex')}"
            
    # 2. Genetic GLA mutation validation
    if "gla" in text_lower or "mutation" in text_lower or "genetic" in text_lower:
        genetic_status = patient_profile.get("genetic_status", "")
        if "positive" in genetic_status.lower() or "confirmed" in genetic_status.lower():
            return True, f"Genetic GLA mutation confirmed in profile."
        else:
            return False, "Patient profile does not verify GLA mutation."
            
    # 2b. Dialysis and Transplant history check
    if "dialysis" in text_lower or "transplant" in text_lower:
        history_dialysis = patient_profile.get("on_dialysis", False)
        history_transplant = patient_profile.get("kidney_transplant", False)
        if "dialysis" in text_lower and history_dialysis:
            return True, "Patient is currently receiving dialysis (exclusion met)"
        if "transplant" in text_lower and history_transplant:
            return True, "Patient has history of kidney transplantation (exclusion met)"
        return False, "Patient has no history of dialysis or kidney transplantation"
            
    # 3. Pregnancy exclusion check
    if "pregnan" in text_lower or "breastfeeding" in text_lower:
        # Returning False means the patient DOES NOT match this exclusion condition (i.e. they are NOT pregnant, which is a PASS).
        if patient_profile.get("sex") == "Male":
            return False, "Patient is Male (pregnancy exclusion not met)"
        else:
            return None, "Female pregnancy/breastfeeding status requires manual record verification."
            
    return None, "Categorical condition did not match structured parser patterns."
