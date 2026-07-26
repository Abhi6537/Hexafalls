import os
import sys
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../generator")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../ner")))

import config
from agents.retrieval_agent import RetrievalAgent
from agents.matching_agent import MatchingAgent
from agents.explainability_agent import ExplainabilityAgent

class Orchestrator:
    """
    Coordinates Retrieval, Matching, and Explainability agents to process 
    a clinical trial matching pipeline. (Unit 5.4)
    """
    def __init__(self):
        print("\n--- Initializing RareMatch AI Multi-Agent Orchestrator ---")
        self.retrieval_agent = RetrievalAgent()
        self.matching_agent = MatchingAgent()
        self.explainability_agent = ExplainabilityAgent()
        
    def match_patient_pipeline(self, patient_profile, limit=3, persona="doctor"):
        """
        Runs the full end-to-end multi-agent clinical matching flow.
        1. Retrieval Agent semantic-searches trials.
        2. Matching Agent runs scoring on candidates.
        3. Explainability Agent explains matching results.
        """
        print(f"\nOrchestrator: Beginning match pipeline for Patient {patient_profile.get('patient_id')}...")
        
        # 1. Retrieve candidates
        candidates = self.retrieval_agent.retrieve_candidate_trials(patient_profile, limit=limit)
        if not candidates:
            return {
                "patient_id": patient_profile.get("patient_id"),
                "status": "NO_TRIALS_FOUND",
                "reports": []
            }
            
        # 2. Run matching engine
        match_reports = self.matching_agent.evaluate_trials(patient_profile, candidates)
        
        # 3. Generate explanations
        final_reports = []
        for report in match_reports:
            explanation = self.explainability_agent.generate_explanation_report(patient_profile, report, persona=persona)
            final_reports.append({
                "match_report": report,
                "explanation_md": explanation
            })
            
        return {
            "patient_id": patient_profile.get("patient_id"),
            "status": "SUCCESS",
            "reports": final_reports
        }

if __name__ == "__main__":
    # Test Orchestrator end-to-end pipeline (Unit 5.5)
    from symptom_dist import generate_patient_distribution
    
    # Generate test patient twin profile
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../generator")))
    patient = generate_patient_distribution("PAT-TEST-AGENT")
    
    # Run Orchestrator pipeline
    orchestrator = Orchestrator()
    results = orchestrator.match_patient_pipeline(patient, limit=1)
    
    print("\n=======================================================")
    print("      END-TO-END PIPELINE RUN COMPLETED (Unit 5.5)      ")
    print("=======================================================")
    if results["status"] == "SUCCESS":
        report_data = results["reports"][0]
        match = report_data["match_report"]
        print(f"Matched Trial: {match['trial_nct_id']} - {match['trial_title']}")
        print(f"Match Score: {match['match_percentage']}% | Recommendation: {match['eligibility_status']}")
        print("\n--- Google Gemini Explanation ---")
        print(report_data["explanation_md"])
    else:
        print("Pipeline failed to locate matching trials.")
