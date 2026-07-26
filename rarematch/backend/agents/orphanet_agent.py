import urllib.request
import urllib.parse
import json

class OrphanetAgent:
    """
    Validates disease names against the EBI OLS API (Orphanet Rare Disease Ontology).
    Translates synonyms to their official primary name.
    """
    def __init__(self):
        print("Orphanet Agent: Initialized (Connecting to EBI OLS API).")
        
    def verify_disease(self, disease_name: str) -> dict:
        if not disease_name or disease_name.lower() == "unknown disease":
            return {"official_name": "Unknown Disease", "is_verified": False, "orphanet_id": None}
            
        disease_str = str(disease_name).lower()
        if "fabry" in disease_str:
            disease_name = "Fabry Disease"
        elif "gaucher" in disease_str:
            disease_name = "Gaucher Disease"
        elif "pompe" in disease_str:
            disease_name = "Pompe Disease"
            
        print(f"Orphanet Agent: Verifying '{disease_name}'...")
        encoded = urllib.parse.quote(disease_name)
        search_url = f"https://www.ebi.ac.uk/ols4/api/search?q={encoded}&ontology=ordo"
        
        print("\n" + "="*75)
        print("🌐 [GOV API REQUEST] Fetching disease ontology from EBI (Orphanet) API...")
        print(f"📡 Endpoint URL: https://www.ebi.ac.uk/ols4/api/search?q={disease_name}&ontology=ordo")
        print("="*75 + "\n")
        
        try:
            req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
            res = urllib.request.urlopen(req, timeout=10)
            data = json.loads(res.read().decode())
            
            docs = data.get("response", {}).get("docs", [])
            if docs:
                official = docs[0].get("label")
                obo_id = docs[0].get("obo_id")
                orpha_id = obo_id.replace("ORDO:", "ORPHA:") if obo_id else None
                print(f"Orphanet Agent: Verification SUCCESS -> Official Name: {official} ({orpha_id})")
                return {"official_name": official, "is_verified": True, "orphanet_id": orpha_id}
            else:
                print(f"Orphanet Agent: Verification FAILED -> No match found in Orphanet.")
                return {"official_name": disease_name, "is_verified": False, "orphanet_id": None}
                
        except Exception as e:
            print(f"Orphanet Agent: Error calling OLS API: {e}")
            return {"official_name": disease_name, "is_verified": False, "orphanet_id": None}
