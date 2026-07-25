import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../matching")))
import config
from scoring_engine import score_patient_against_trial

class MatchingAgent:
    """
    Evaluates patient profile details against a list of clinical trials 
    using the hybrid scoring matcher. (Unit 5.2)
    """
    def __init__(self):
        print("Matching Agent: Initialized scoring engine evaluator.")
        
    def evaluate_trials(self, patient_profile, candidate_trials):
        """
        Runs the hybrid matching scorer on each trial candidate and returns reports.
        """
        match_reports = []
        for trial in candidate_trials:
            print(f"Matching Agent: Evaluating {trial['nctId']}...")
            report = score_patient_against_trial(patient_profile, trial)
            match_reports.append(report)
        return match_reports
