# Know Your Trial

Know Your Trial is an AI-powered Neomorphic Dashboard and application designed to process patient documents (such as clinical notes and PDFs) and match patients with rare diseases to suitable clinical trials.

The project is split into a Python FastAPI backend and a modern React frontend.

## Features

- **Document Processing**: Upload patient PDFs or paste clinical text directly.
- **NER Agent**: Extracts patient phenotypes and entities using advanced AI models.
- **Disease Verification**: Validates rare diseases against the Orphanet database to ensure accuracy.
- **Trial Matching**: Uses an orchestrator agent and vector database search (ChromaDB) to find relevant clinical trials and evaluate patient eligibility.
- **Data Persistence**: Saves patient profiles and match reports via Supabase.
- **Neomorphic UI**: A sleek, modern, and user-friendly interface for healthcare professionals.

## Project Structure

```
Hexafalls/
└── rarematch/
    ├── backend/       # FastAPI application, AI agents, RAG pipeline, and Vector DB
    ├── frontend/      # React application (Vite, Framer Motion)
    └── sample_pdfs/   # Sample patient reports for testing
```

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+ (for frontend development)
- Supabase account and project

### 1. Environment Setup
Create a `.env` file in the `rarematch` directory (you can use `rarematch/.env.example` as a template) and add your necessary API keys (Supabase, Gemini API, etc.).

### 2. Backend Setup
1. Navigate to the `rarematch` directory.
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server from the `backend` directory:
   ```bash
   python backend/main.py
   ```
   *Note: Ensure you have your `GEMINI_API_KEY` configured and have sufficient quota if you are using Gemini models.*

### 3. Frontend Setup
1. Navigate to the `rarematch/frontend` directory.
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Technologies Used
- **Backend**: FastAPI, LangChain, LangGraph, HuggingFace Transformers, ChromaDB, PyPDF2
- **Frontend**: React, Vite, Framer Motion, Recharts, Lucide React
- **Database**: Supabase
- **AI / LLMs**: Google Gemini, Sentence-Transformers, BioBERT
