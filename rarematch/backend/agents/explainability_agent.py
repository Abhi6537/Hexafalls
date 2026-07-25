import google.generativeai as genai
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

class ExplainabilityAgent:
    """
    Takes patient details and trial match reports and queries Google Gemini 
    to write structural explainability feedback for doctors. (Unit 5.3)
    """
    def __init__(self):
        # Configure Gemini API client
        api_key = config.GOOGLE_API_KEY
        if not api_key:
            raise ValueError("Missing GOOGLE_API_KEY environment variable. Add it to .env.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(config.LLM_MODEL)
        print(f"Explainability Agent: Initialized Gemini model ({config.LLM_MODEL}).")
        
    def generate_explanation_report(self, patient_profile, match_report):
        """
        Calls Gemini to explain eligibility criteria passes/fails.
        """
        patient_summary = (
            f"Patient Profile:\n"
            f"- Sex: {patient_profile.get('sex')}\n"
            f"- Age: {patient_profile.get('age')}\n"
            f"- eGFR Kidney Lab: {patient_profile.get('labs', {}).get('eGFR')}\n"
            f"- ERT duration: {patient_profile.get('ert_duration_months')} months\n"
            f"- Symptoms: {', '.join(patient_profile.get('phenotypes', []))}\n"
        )
        
        criteria_list_str = ""
        for idx, crit in enumerate(match_report["criteria_results"]):
            criteria_list_str += (
                f" {idx+1}. Requirement: \"{crit['criterion_text']}\"\n"
                f"    Type: {crit['type']} | Category: {crit['category'].upper()}\n"
                f"    Match Engine Decision: {crit['status']}\n"
                f"    Matcher Evidence: {crit['evidence']}\n\n"
            )
            
        prompt = (
            f"You are a clinical trial matching expert advising a physician.\n"
            f"Analyze the matching report below and generate a concise, professional explanation.\n\n"
            f"{patient_summary}\n"
            f"Trial NCT ID: {match_report['trial_nct_id']}\n"
            f"Trial Title: {match_report['trial_title']}\n"
            f"Match Engine Score: {match_report['match_percentage']}%\n"
            f"Recommendation: {match_report['eligibility_status']}\n\n"
            f"Criteria Details:\n"
            f"{criteria_list_str}\n"
            f"Please structure your output using these sections:\n"
            f"1. **Summary Recommendation**: Concise medical summary of eligibility.\n"
            f"2. **Inclusion Breakdown**: Explain why key inclusion points passed or failed.\n"
            f"3. **Exclusion Warnings**: Explain why exclusion points passed, failed, or are uncertain.\n"
            f"4. **Suggested Next Steps**: Actions for the physician (e.g. order lab verification, check pregnancy, schedule screening)."
        )
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Explainability Agent: Gemini API call failed: {e}")
            # Text fallback if API errors/limits are reached
            return (
                f"### Clinical Match Explanation (Local Fallback)\n"
                f"**Trial:** {match_report['trial_nct_id']} - {match_report['trial_title']}\n"
                f"**Match Score:** {match_report['match_percentage']}%\n"
                f"**Status:** {match_report['eligibility_status']}\n\n"
                f"Please manually review the criteria breakdown list. Gemini explanation unavailable."
            )
