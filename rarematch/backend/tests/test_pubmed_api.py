"""
Unit 0.6 — Test PubMed API
Fetches 2 Fabry Disease case reports and prints their abstracts.
Expected output: PubMed IDs, titles, and abstract text.
"""

import requests

ESEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
EFETCH_URL  = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

print("\n--- Testing PubMed API ---\n" + "="*50)

# Step 1: Search for Fabry Disease case reports
search_params = {
    "db":       "pubmed",
    "term":     "Fabry disease case report[Title/Abstract]",
    "retmax":   2,
    "retmode":  "json",
    "sort":     "relevance"
}

try:
    # Search
    search_resp = requests.get(ESEARCH_URL, params=search_params, timeout=15)
    search_resp.raise_for_status()
    search_data = search_resp.json()

    ids = search_data["esearchresult"]["idlist"]
    print(f"[OK] Search returned {len(ids)} result(s). IDs: {ids}\n")

    if not ids:
        print("[WARN] No results found. Try a different search term.")
    else:
        # Step 2: Fetch abstracts
        fetch_params = {
            "db":      "pubmed",
            "id":      ",".join(ids),
            "rettype": "abstract",
            "retmode": "text"
        }
        fetch_resp = requests.get(EFETCH_URL, params=fetch_params, timeout=15)
        fetch_resp.raise_for_status()

        print("Sample abstracts:\n" + "-"*40)
        # Print first 800 characters
        print(fetch_resp.text[:800])
        print("\n...")
        print("\n[OK] PubMed API is working correctly.\n")

except requests.exceptions.RequestException as e:
    print(f"[FAIL] API call failed: {e}\n")
