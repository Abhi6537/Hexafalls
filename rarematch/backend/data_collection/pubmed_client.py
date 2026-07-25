import requests
from Bio import Entrez
import json
import xml.etree.ElementTree as ET

# Entrez requires an email address for queries
Entrez.email = "clinical_matcher@example.com"

def search_pubmed_case_reports(disease="Fabry Disease", max_results=20):
    """
    Searches PubMed for case reports matching a specific disease.
    Returns a list of dictionaries with PMID, title, and abstract text.
    """
    term = f"{disease} case report[Title/Abstract]"
    print(f"Searching PubMed for '{term}'...")
    
    try:
        # Step 1: Search for article PMIDs
        handle = Entrez.esearch(db="pubmed", term=term, retmax=max_results, sort="relevance")
        record = Entrez.read(handle)
        handle.close()
        
        id_list = record.get("IdList", [])
        if not id_list:
            print("No case reports found on PubMed.")
            return []
            
        print(f"Found {len(id_list)} articles. Fetching details...")
        
        # Step 2: Fetch details of the articles
        id_str = ",".join(id_list)
        handle = Entrez.efetch(db="pubmed", id=id_str, retmode="xml")
        xml_data = handle.read()
        handle.close()
        
        # Step 3: Parse XML responses
        root = ET.fromstring(xml_data)
        case_reports = []
        
        for article in root.findall(".//PubmedArticle"):
            pmid = article.find(".//PMID").text
            
            title_node = article.find(".//ArticleTitle")
            title = "".join(title_node.itertext()) if title_node is not None else "No Title"
            
            abstract_node = article.find(".//Abstract")
            abstract = ""
            if abstract_node is not None:
                abstract_texts = []
                for text_node in abstract_node.findall(".//AbstractText"):
                    label = text_node.get("Label")
                    text = "".join(text_node.itertext())
                    if label:
                        abstract_texts.append(f"{label}: {text}")
                    else:
                        abstract_texts.append(text)
                abstract = "\n".join(abstract_texts)
            else:
                abstract = "No Abstract Available"
                
            case_reports.append({
                "pmid": pmid,
                "title": title,
                "abstract": abstract
            })
            
        return case_reports
        
    except Exception as e:
        print(f"Error fetching from PubMed API: {e}")
        return []

if __name__ == "__main__":
    reports = search_pubmed_case_reports(max_results=3)
    print(f"\nFetched {len(reports)} case reports from PubMed!")
    for idx, r in enumerate(reports):
        print(f"\nCase #{idx+1} (PMID {r['pmid']}): {r['title']}")
        print(f"Abstract (first 200 chars): {r['abstract'][:200]}...")
