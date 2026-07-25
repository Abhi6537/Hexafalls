from sentence_transformers import SentenceTransformer
import chromadb
import numpy as np
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

# Global embedding model pointer
embed_model = None

def load_embedding_model():
    global embed_model
    if embed_model is None:
        print(f"Loading PubMedBERT embedding model: {config.PUBMEDBERT_MODEL}...")
        embed_model = SentenceTransformer(config.PUBMEDBERT_MODEL)

def evaluate_semantic_criterion(criterion_text, patient_phenotypes, threshold=0.70):
    """
    Computes embedding-based semantic similarity between a qualitative trial criterion 
    and the patient's HPO phenotypes list. (Unit 4.4)
    Returns: (status: bool/None, similarity_score: float, matching_symptom: str)
    """
    load_embedding_model()
    
    if not patient_phenotypes:
        return False, 0.0, "No symptoms listed in patient profile."
        
    # Generate vector for the trial criterion
    crit_vector = embed_model.encode(criterion_text)
    
    # Generate vectors for all patient symptoms
    symptom_vectors = embed_model.encode(patient_phenotypes)
    
    # Calculate cosine similarities
    # cosine_similarity = (A . B) / (||A|| * ||B||)
    crit_norm = np.linalg.norm(crit_vector)
    symptom_norms = np.linalg.norm(symptom_vectors, axis=1)
    
    dot_products = np.dot(symptom_vectors, crit_vector)
    similarities = dot_products / (crit_norm * symptom_norms)
    
    # Get highest matching symptom
    max_idx = np.argmax(similarities)
    best_score = float(similarities[max_idx])
    best_symptom = patient_phenotypes[max_idx]
    
    # Determine pass status based on threshold
    passed = best_score >= threshold
    
    return passed, best_score, best_symptom

if __name__ == "__main__":
    # Test qualitative matching
    crit = "Neuropathic pain in hands and feet"
    symptoms = ["extremity burning pain", "corneal whorls", "angiokeratoma"]
    
    passed, score, sym = evaluate_semantic_criterion(crit, symptoms)
    print(f"Criterion: '{crit}'")
    print(f"Best Match Symptom: '{sym}'")
    print(f"Similarity Score: {score:.4f} (Passed: {passed})")
