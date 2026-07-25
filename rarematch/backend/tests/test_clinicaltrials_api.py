"""
Unit 0.5 — Test ClinicalTrials.gov API
Fetches 2 Fabry Disease trials and prints key fields.
Expected output: Trial ID, title, and eligibility criteria text.
"""

import requests
import json

BASE_URL = "https://clinicaltrials.gov/api/v2/studies"

params = {
    "query.cond": "Fabry Disease",
    "filter.overallStatus": "RECRUITING",
    "pageSize": 2,
    "fields": "NCTId,BriefTitle,EligibilityModule,StatusModule,PhaseList"
}

print("\n--- Testing ClinicalTrials.gov API ---\n" + "="*50)

try:
    response = requests.get(BASE_URL, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    studies = data.get("studies", [])
    print(f"[OK] API responded. Found {len(studies)} trial(s)\n")

    for study in studies:
        proto = study.get("protocolSection", {})
        id_mod = proto.get("identificationModule", {})
        status_mod = proto.get("statusModule", {})
        elig_mod = proto.get("eligibilityModule", {})

        nct_id = id_mod.get("nctId", "N/A")
        title  = id_mod.get("briefTitle", "N/A")
        status = status_mod.get("overallStatus", "N/A")
        criteria_text = elig_mod.get("eligibilityCriteria", "N/A")

        print(f"  Trial ID : {nct_id}")
        print(f"  Title    : {title}")
        print(f"  Status   : {status}")
        print(f"  Criteria (first 300 chars):")
        print(f"  {criteria_text[:300]}...")
        print()

    print("[OK] ClinicalTrials.gov API is working correctly.\n")

except requests.exceptions.RequestException as e:
    print(f"[FAIL] API call failed: {e}\n")
