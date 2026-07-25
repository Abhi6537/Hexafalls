import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import pandas as pd
import json
import pickle
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

# Global variables for models
vectorizer = None
clf_model = None
embedding_model = None

def load_classifier_models():
    """
    Loads TF-IDF vectorizer and decision tree classifier weights.
    """
    global vectorizer, clf_model
    vec_path = config.CLASSIFIER_DIR / "tfidf_vectorizer.pkl"
    model_path = config.CLASSIFIER_DIR / "tree_model.pkl"
    
    with open(vec_path, "rb") as f:
        vectorizer = pickle.load(f)
    with open(model_path, "rb") as f:
        clf_model = pickle.load(f)

def classify_criterion_type(text):
    """
    Predicts the classification type of a criterion string. (Unit 3.4)
    """
    global vectorizer, clf_model
    if not vectorizer or not clf_model:
        load_classifier_models()
        
    features = vectorizer.transform([text])
    prediction = clf_model.predict(features)[0]
    return prediction

def build_vector_store():
    """
    Loads parsed criteria, runs type classification, generates PubMedBERT sentence embeddings, 
    and inserts the records into ChromaDB. (Units 3.1, 3.4, 3.5, 3.6)
    """
    print("\n--- Initializing Vector Store Database (ChromaDB) ---")
    
    # 1. Load parsed trials (generated in Module 1)
    parsed_trials_path = config.TRIALS_DIR / "parsed_trials.json"
    if not parsed_trials_path.exists():
        raise FileNotFoundError(f"Missing criteria source: {parsed_trials_path}. Run run_pipeline.py first.")
        
    with open(parsed_trials_path, "r", encoding="utf-8") as f:
        parsed_trials = json.load(f)
        
    # 2. Load PubMedBERT sentence transformer (Unit 3.5)
    print(f"Loading PubMedBERT embedding model: {config.PUBMEDBERT_MODEL}...")
    embed_model = SentenceTransformer(config.PUBMEDBERT_MODEL)
    
    # 3. Connect to local ChromaDB instance (Unit 3.6)
    print(f"Setting up persistent database storage at {config.VECTOR_DB_DIR}...")
    chroma_client = chromadb.PersistentClient(path=str(config.VECTOR_DB_DIR))
    
    # Reset existing collection if present to avoid duplicate indices
    try:
        chroma_client.delete_collection("trial_criteria")
        print("Cleared previous trial collection.")
    except Exception:
        pass
        
    collection = chroma_client.create_collection(
        name="trial_criteria",
        metadata={"hnsw:space": "cosine"} # Use cosine similarity for medical vectors
    )
    
    # 4. Process and index criteria
    print("Ingesting trial criteria records...")
    
    ids = []
    documents = []
    embeddings = []
    metadatas = []
    
    criterion_counter = 1
    
    for trial in parsed_trials:
        nct_id = trial["nctId"]
        title = trial["title"]
        
        # Helper to process criteria list
        def process_list(criteria_list, category_label):
            nonlocal criterion_counter
            for crit in criteria_list:
                # Classify criterion type (Unit 3.4)
                crit_type = classify_criterion_type(crit)
                
                # Generate sentence vector (Unit 3.5)
                vector = embed_model.encode(crit).tolist()
                
                cid = f"CRIT-{criterion_counter:04d}"
                
                ids.append(cid)
                documents.append(crit)
                embeddings.append(vector)
                metadatas.append({
                    "criterion_id": cid,
                    "nct_id": nct_id,
                    "trial_title": title,
                    "rule_type": crit_type,
                    "category": category_label # "inclusion" or "exclusion"
                })
                
                criterion_counter += 1
                
        process_list(trial["inclusion_criteria"], "inclusion")
        process_list(trial["exclusion_criteria"], "exclusion")
        
    # Add records to ChromaDB
    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas
    )
    
    print(f"\nSuccess: Index complete! Added {len(ids)} criteria to ChromaDB vector store.")
    return len(ids)

if __name__ == "__main__":
    count = build_vector_store()
