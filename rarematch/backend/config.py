"""
RareMatch AI — Central Configuration
All settings in one place. Edit this file to change behaviour.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT_DIR        = Path(__file__).parent
DATA_DIR        = ROOT_DIR / "data"
TRIALS_DIR      = DATA_DIR / "trials"
CASE_REPORTS_DIR = DATA_DIR / "case_reports"
TRAINING_DIR    = DATA_DIR / "training"
MODELS_DIR      = ROOT_DIR / "models"
NER_MODEL_DIR   = MODELS_DIR / "ner"
GPT2_MODEL_DIR  = MODELS_DIR / "gpt2"
EMBEDDINGS_DIR  = MODELS_DIR / "embeddings"
CLASSIFIER_DIR  = MODELS_DIR / "classifier"
VECTOR_DB_DIR   = ROOT_DIR / "vector_db"

# ── Disease Focus ───────────────────────────────────────────────────────────────
TARGET_DISEASE  = "Fabry Disease"          # The rare disease we're demoing
ORPHANET_ID     = "ORPHA:324"
OMIM_ID         = "301500"

# ── ClinicalTrials.gov API ─────────────────────────────────────────────────────
CT_API_BASE     = "https://clinicaltrials.gov/api/v2/studies"
CT_MAX_TRIALS   = 15                       # How many trials to fetch
CT_STATUS       = "RECRUITING"             # Only recruiting trials

# ── PubMed API ─────────────────────────────────────────────────────────────────
PUBMED_API_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
PUBMED_MAX_RESULTS = 25                    # How many case reports to fetch

# ── Models ─────────────────────────────────────────────────────────────────────
GPT2_BASE_MODEL = "gpt2"                   # Base pre-trained model for twin generator
BIOBERT_MODEL   = "dmis-lab/biobert-v1.1"           # Clinical NER base model
PUBMEDBERT_MODEL = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract"  # Embeddings

# ── Local API Server (Laptop 2 / Colab GPU Connections) ────────────────────────
# Replace with the actual IP address or Ngrok URLs from Google Colab
LAPTOP_2_API_URL = "https://unlighted-lesser-splurge.ngrok-free.dev" # GPT-2 Generator URL (Port 8000)
NER_SERVICE_API_URL = "http://localhost:8001"                         # BioBERT NER Extraction URL (Port 8001)

# ── LLM API ────────────────────────────────────────────────────────────────────
GOOGLE_API_KEY     = os.getenv("GOOGLE_API_KEY", "")
LLM_PROVIDER       = "google"              # "google" (free Gemini API)
LLM_MODEL          = "gemini-2.0-flash"    # Standard model

# ── Supabase Configuration ─────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase_client = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    from supabase import create_client, Client
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
else:
    print("WARNING: Supabase credentials not found. Database features will be disabled.")

# ── NER Training ───────────────────────────────────────────────────────────────
NER_EPOCHS        = 3
NER_BATCH_SIZE    = 16
NER_LR            = 2e-5
NER_MAX_LEN       = 512

# ── Matching ───────────────────────────────────────────────────────────────────
SEMANTIC_SIMILARITY_THRESHOLD = 0.75     # Min score to consider a semantic match
TOP_K_TRIALS      = 10                   # How many trials to rank per patient

# ── NER Labels ─────────────────────────────────────────────────────────────────
NER_LABELS = [
    "O",           # Outside (not a medical entity)
    "B-DISEASE",   # Beginning of disease name
    "I-DISEASE",   # Inside disease name
    "B-MEDICATION",
    "I-MEDICATION",
    "B-LAB",
    "I-LAB",
    "B-SYMPTOM",
    "I-SYMPTOM",
    "B-DOSAGE",
    "I-DOSAGE",
    "B-DURATION",
    "I-DURATION",
    "B-NEGATION",
    "I-NEGATION",
]
