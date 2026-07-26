import re

def evaluate_numeric_criterion(criterion_text, patient_profile, _patient_age_deprecated):
    """
    Parses inequality statements (e.g. "Age >= 18", "eGFR >= 30") and compares 
    against structured patient records. (Unit 4.1)
    Returns: (status: bool/None, evidence: str)
    """
    text_lower = criterion_text.lower()
    
    # 1. Parse age-related checks
    if "age" in text_lower or "aged" in text_lower:
        age_str = patient_profile.get("age") or ""
        age_match = re.search(r"(\d+)", str(age_str))
        if not age_match:
            return None, "Patient age is missing or invalid in record."
        patient_age = int(age_match.group(1))

        # Match ">= 18", ">=18", ">= 18 years", "18 years or older", "aged 18 to 50"
        # 1.1 Match ranges: "18 to 50"
        range_match = re.search(r"(\d+)\s*to\s*(\d+)", text_lower)
        if range_match:
            min_val = int(range_match.group(1))
            max_val = int(range_match.group(2))
            passed = min_val <= patient_age <= max_val
            return passed, f"Patient age is {patient_age} (Required: {min_val}-{max_val})"
            
        # 1.2 Match lower bounds: ">= 18", "18 years or older", "aged 18 and older"
        gte_match = re.search(r"(?:>=|greater than or equal to|>=)\s*(\d+)", text_lower)
        if gte_match:
            val = int(gte_match.group(1))
            passed = patient_age >= val
            return passed, f"Patient age is {patient_age} (Required: >= {val})"
            
        # Or written as "18 years or older"
        older_match = re.search(r"(\d+)\s*(?:years|yo)?\s*(?:or older|and older|or more)", text_lower)
        if older_match:
            val = int(older_match.group(1))
            passed = patient_age >= val
            return passed, f"Patient age is {patient_age} (Required: >= {val})"
            
    # 2. Parse eGFR kidney lab values
    if "egfr" in text_lower or "glomerular filtration" in text_lower:
        egfr_str = patient_profile.get("egfr") or patient_profile.get("kidney_egfr") or ""
        egfr_match = re.search(r"(\d+)", str(egfr_str))
        if not egfr_match:
            return None, "Patient renal lab (eGFR) missing in record."
        egfr_val = int(egfr_match.group(1))
            
        # Match lower bounds: ">= 30", ">= 45"
        gte_match = re.search(r"(?:>=|greater than or equal to)\s*(\d+)", text_lower)
        if gte_match:
            val = int(gte_match.group(1))
            passed = egfr_val >= val
            return passed, f"Patient eGFR is {egfr_val} (Required: >= {val})"
            
        # Match lower bounds written as "> 30"
        gt_match = re.search(r"(?:>|greater than)\s*(\d+)", text_lower)
        if gt_match:
            val = int(gt_match.group(1))
            passed = egfr_val > val
            return passed, f"Patient eGFR is {egfr_val} (Required: > {val})"
            
        # Match upper bounds: "< 30"
        lt_match = re.search(r"(?:<|less than)\s*(\d+)", text_lower)
        if lt_match:
            val = int(lt_match.group(1))
            passed = egfr_val < val
            return passed, f"Patient eGFR is {egfr_val} (Required: < {val})"
            
    return None, "Numeric condition did not match structured parser patterns."
