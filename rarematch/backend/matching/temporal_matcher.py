import re

def evaluate_temporal_criterion(criterion_text, ert_duration_months):
    """
    Evaluates temporal restrictions such as therapy durations (e.g. "ERT >= 12 months") 
    or exclusion lookbacks (e.g. "stroke within 6 months"). (Unit 4.2)
    Returns: (status: bool/None, evidence: str)
    """
    text_lower = criterion_text.lower()
    
    # 1. Evaluate inclusion therapy durations (Enzyme Replacement Therapy - ERT)
    if "ert" in text_lower or "enzyme replacement" in text_lower or "therapy" in text_lower:
        # Match ">= 12 months", "12 months or longer", "1 year"
        # Extract number of months
        month_match = re.search(r"(\d+)\s*(?:month|mo)", text_lower)
        year_match = re.search(r"(\d+)\s*year", text_lower)
        
        required_months = 0
        if month_match:
            required_months = int(month_match.group(1))
        elif year_match:
            required_months = int(year_match.group(1)) * 12
            
        if required_months > 0:
            passed = ert_duration_months >= required_months
            return passed, f"Patient was on ERT for {ert_duration_months} months (Required: >= {required_months})"
            
    # 2. Evaluate exclusion lookbacks ("stroke within 6 months")
    if "stroke" in text_lower or "tia" in text_lower or "infarction" in text_lower or "cardiac event" in text_lower:
        # If the exclusion criteria is "stroke within 6 months" and patient has history of stroke within that time, 
        # return False (fails check). If no stroke, returns True.
        if "within" in text_lower or "past" in text_lower:
            month_match = re.search(r"(\d+)\s*(?:month|mo)", text_lower)
            lookback = int(month_match.group(1)) if month_match else 6
            # We will return None here so that the negation + semantic matcher can double check the patient's note context
            return None, f"Exclusion lookback ({lookback} months) requires patient note narrative context."
            
    return None, "Temporal condition did not match structured parser patterns."
