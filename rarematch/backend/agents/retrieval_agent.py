import chromadb
from sentence_transformers import SentenceTransformer
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

class RetrievalAgent:
    """
    Retrieves the top candidate clinical trials for a patient's phenotypes 
    using semantic search query vectors against ChromaDB. (Unit 5.1)
    """
    def __init__(self):
        self.chroma_client = chromadb.PersistentClient(path=str(config.VECTOR_DB_DIR))
        self.collection = self.chroma_client.get_collection(name="trial_criteria")
        print(f"Retrieval Agent: Connected to ChromaDB. Loading PubMedBERT...")
        self.embed_model = SentenceTransformer(config.PUBMEDBERT_MODEL)
        
    def retrieve_candidate_trials(self, patient_phenotypes, limit=3):
        """
        Takes patient phenotype strings, embeds them, and searches ChromaDB 
        to find corresponding active trials. Returns unique trial structures.
        """
        if not patient_phenotypes:
            print("Retrieval Agent: No patient phenotypes provided.")
            return []
            
        print(f"Retrieval Agent: Analyzing symptoms: {patient_phenotypes}")
        query_text = " ".join(patient_phenotypes)
        query_vector = self.embed_model.encode(query_text).tolist()
        
        # Query ChromaDB collection
        results = collection_results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=10 # Get top 10 criteria matches, then group by unique trials
        )
        
        trial_nct_ids = set()
        candidates = []
        
        # Read candidate trials json database to get inclusion/exclusion list structure
        parsed_trials_path = config.TRIALS_DIR / "parsed_trials.json"
        with open(parsed_trials_path, "r", encoding="utf-8") as f:
            all_trials = json.load(f)
            
        for meta in results["metadatas"][0]:
            nct_id = meta["nct_id"]
            if nct_id not in trial_nct_ids:
                trial_nct_ids.add(nct_id)
                # Find matching trial details from the database
                for t in all_trials:
                    if t["nctId"] == nct_id:
                        candidates.append(t)
                        break
                        
            if len(candidates) >= limit:
                break
                
        print(f"Retrieval Agent: Identified {len(candidates)} candidate trials for evaluation.")
        return candidates

if __name__ == "__main__":
    agent = RetrievalAgent()
    candidates = agent.retrieve_candidate_trials(["Fabry disease", "neuropathic pain", "kidney disease"])
    for t in candidates:
        print(f" - {t['nctId']}: {t['title']}")
