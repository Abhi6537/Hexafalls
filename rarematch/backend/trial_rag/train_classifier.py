import os
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
import pickle
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def build_labeled_seed_dataset():
    """
    Unit 3.2 — Manually labeled seed dataset of 50 criteria statements categorized by type:
    NUMERIC / TEMPORAL / CATEGORICAL / QUALITATIVE
    """
    seed_data = [
        # Numeric checks
        ("Age >= 18 years", "NUMERIC"),
        ("Aged 18 to 65 years", "NUMERIC"),
        ("eGFR >= 30 mL/min/1.73 m2", "NUMERIC"),
        ("eGFR < 30 ml/min", "NUMERIC"),
        ("Weight >= 50 kg", "NUMERIC"),
        ("Glomerular filtration rate between 30 and 90", "NUMERIC"),
        ("Body mass index under 35", "NUMERIC"),
        ("Platelet count greater than 100,000", "NUMERIC"),
        ("Systolic blood pressure under 140 mmHg", "NUMERIC"),
        ("Hemoglobin level >= 10 g/dL", "NUMERIC"),
        # Temporal checks (duration of illness, therapy timeline)
        ("Stable on ERT for at least 12 months", "TEMPORAL"),
        ("On ERT therapy for 2 years or longer", "TEMPORAL"),
        ("Stroke or TIA within the last 6 months", "TEMPORAL"),
        ("Myocardial infarction within past 180 days", "TEMPORAL"),
        ("No change in dosage for 6 months", "TEMPORAL"),
        ("Diagnosed within past 3 years", "TEMPORAL"),
        ("Organ transplant within past 12 months", "TEMPORAL"),
        ("Symptoms presenting for at least 6 months", "TEMPORAL"),
        ("Receiving enzyme therapy for over 1 year", "TEMPORAL"),
        ("No major surgery within 30 days", "TEMPORAL"),
        # Categorical checks (gene mutations, direct diagnoses, sex)
        ("Documented clinical diagnosis of Fabry disease", "CATEGORICAL"),
        ("Confirmed GLA gene mutation", "CATEGORICAL"),
        ("Male or female patients", "CATEGORICAL"),
        ("Female of childbearing potential", "CATEGORICAL"),
        ("Male patients only", "CATEGORICAL"),
        ("History of kidney transplantation", "CATEGORICAL"),
        ("Currently receiving dialysis", "CATEGORICAL"),
        ("Active hepatitis B or C infection", "CATEGORICAL"),
        ("Presence of neutralizing antibodies to AAV capsid", "CATEGORICAL"),
        ("Known GLA mutation mutation positive status", "CATEGORICAL"),
        # Qualitative checks (symptoms, general conditions, severity)
        ("Neuropathic pain in hands and feet", "QUALITATIVE"),
        ("Severe cardiac hypertrophy", "QUALITATIVE"),
        ("Recurrent burning extremity pain", "QUALITATIVE"),
        ("Chronic fatigue or joint pain", "QUALITATIVE"),
        ("History of severe allergic reactions", "QUALITATIVE"),
        ("Heart failure class III or IV", "QUALITATIVE"),
        ("Corneal opacity or verticillata", "QUALITATIVE"),
        ("Angiokeratoma on torso or extremities", "QUALITATIVE"),
        ("Uncontrolled cardiovascular disease", "QUALITATIVE"),
        ("Any medical condition compromising safety", "QUALITATIVE")
    ]
    # Expand dataset slightly to reach 50+ lines
    extra_items = [
        ("Aged under 18 years", "NUMERIC"),
        ("eGFR >= 45", "NUMERIC"),
        ("Duration of therapy >= 12 months", "TEMPORAL"),
        ("History of stroke within 6 months", "TEMPORAL"),
        ("Classic Fabry disease diagnosis", "CATEGORICAL"),
        ("Renal transplantation history", "CATEGORICAL"),
        ("Known hypersensitivity to migalastat", "CATEGORICAL"),
        ("Corneal verticillata", "QUALITATIVE"),
        ("Severe gastrointestinal symptoms", "QUALITATIVE"),
        ("Hypohidrosis or anhidrosis", "QUALITATIVE")
    ]
    all_data = seed_data + extra_items
    
    df = pd.DataFrame(all_data, columns=["text", "label"])
    output_path = config.TRAINING_DIR / "criteria_labeled_seed.csv"
    df.to_csv(output_path, index=False, encoding="utf-8")
    print(f"Saved {len(df)} labeled criteria to {output_path} (Unit 3.2)")
    return df

def train_criteria_classifier():
    """
    Unit 3.3 — Trains a TF-IDF + Decision Tree Classifier to route criteria by evaluation type.
    """
    df = build_labeled_seed_dataset()
    
    # Train vectorizer
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
    X = vectorizer.fit_transform(df["text"])
    y = df["label"]
    
    # Train decision tree classifier
    clf = DecisionTreeClassifier(max_depth=6, random_state=42)
    clf.fit(X, y)
    print("Criterion classification model trained successfully! (Unit 3.3)")
    
    # Save parameters to local models folder
    vectorizer_path = config.CLASSIFIER_DIR / "tfidf_vectorizer.pkl"
    model_path = config.CLASSIFIER_DIR / "tree_model.pkl"
    
    with open(vectorizer_path, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(model_path, "wb") as f:
        pickle.dump(clf, f)
        
    print(f"Vectorizer saved to {vectorizer_path}")
    print(f"Classifier model saved to {model_path}")

if __name__ == "__main__":
    train_criteria_classifier()
