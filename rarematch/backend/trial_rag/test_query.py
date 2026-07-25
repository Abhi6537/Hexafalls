import chromadb
from sentence_transformers import SentenceTransformer
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def test_query_vector_store(query_text):
    """
    Queries ChromaDB with a natural language search statement and returns the top 3 matches. (Unit 3.7)
    """
    print(f"\n--- Querying ChromaDB with: '{query_text}' ---")
    
    # Load model
    print("Loading PubMedBERT embedding model...")
    embed_model = SentenceTransformer(config.PUBMEDBERT_MODEL)
    query_vector = embed_model.encode(query_text).tolist()
    
    # Connect to ChromaDB
    chroma_client = chromadb.PersistentClient(path=str(config.VECTOR_DB_DIR))
    collection = chroma_client.get_collection(name="trial_criteria")
    
    # Query database
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=3
    )
    
    # Print matches
    print("\nResults returned from database:")
    for idx in range(len(results["ids"][0])):
        cid = results["ids"][0][idx]
        doc = results["documents"][0][idx]
        score = results["distances"][0][idx]
        meta = results["metadatas"][0][idx]
        
        # Convert cosine distance to similarity percentage
        similarity = (1.0 - score) * 100
        
        print(f" [{idx+1}] {cid} | Match: {similarity:.1f}% | Type: {meta['rule_type']} | [{meta['category'].upper()}]")
        print(f"     Text: \"{doc}\"")
        print(f"     Trial: {meta['nct_id']} - {meta['trial_title']}")
        print()

if __name__ == "__main__":
    # Test query 1
    test_query_vector_store("kidney failure or dialysis patient")
    
    # Test query 2
    test_query_vector_store("patients under 18 years old")
