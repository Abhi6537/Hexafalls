import os
from fpdf import FPDF

output_dir = "sample_pdfs"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# We create highly structured, comprehensive text for extraction
patients = [
    {
        "filename": "patient_01_pompe.pdf",
        "title": "Comprehensive Clinical Note - Patient 01",
        "content": [
            "=== 1. DEMOGRAPHICS & VITALS ===",
            "Age: 38 years",
            "Sex at Birth: Male",
            "Weight: 82 kg",
            "Height: 180 cm",
            "BMI: 25.3",
            "Pregnancy/Lactation Status: No",
            "",
            "=== 2. PRIMARY DIAGNOSIS & GENETICS ===",
            "Official Disease Name: Pompe Disease (Alpha-glucosidase deficiency)",
            "Date of Diagnosis: 2019-04-12",
            "Genetic Mutation Code: GAA c.-32-13T>G",
            "Family History: One sibling with late-onset Pompe disease.",
            "",
            "=== 3. CLINICAL SYMPTOMS ===",
            "Active Symptoms: Severe proximal muscle weakness, progressive respiratory distress, chronic fatigue.",
            "Symptom Severity/Mobility: Requires cane for walking >50 meters. Moderate dyspnea on exertion.",
            "Age of Onset: 33 years",
            "",
            "=== 4. LABORATORY BIOMARKERS ===",
            "Kidney Function (eGFR): 85 mL/min/1.73m2",
            "Liver Function (ALT): 35 U/L",
            "Liver Function (AST): 40 U/L",
            "Cardiac Function (Ejection Fraction): 55%",
            "Blood Counts: WBC 6.5K, RBC 4.8M, Platelets 210K",
            "",
            "=== 5. MEDICAL & SURGICAL HISTORY ===",
            "Current Medications: Alglucosidase alfa (Lumizyme) bi-weekly infusions.",
            "Past Experimental Trials: None in the last 6 months.",
            "Transplant History: No history of solid organ or stem cell transplant.",
            "Comorbidities: Mild asthma.",
            "Surgeries: Appendectomy (2010).",
            "Disability Status: 40% physical disability rating.",
            "",
            "=== 6. LIFESTYLE FACTORS ===",
            "Substance History: Non-smoker. Social alcohol use (1-2 drinks/week).",
            "Allergies: Penicillin (Rash)."
        ]
    },
    {
        "filename": "patient_02_gaucher_missing_data.pdf",
        "title": "Comprehensive Clinical Note - Patient 02",
        "content": [
            "=== 1. DEMOGRAPHICS & VITALS ===",
            "Age: 45 years",
            "Sex at Birth: Female",
            "Weight: 65 kg",
            "Height: 165 cm",
            # Intentional missing BMI and Pregnancy Status
            "",
            "=== 2. PRIMARY DIAGNOSIS & GENETICS ===",
            "Official Disease Name: Gaucher Disease Type 1",
            "Date of Diagnosis: 2010-08-22",
            # Intentional missing Genetic Mutation Code
            "Family History: None known.",
            "",
            "=== 3. CLINICAL SYMPTOMS ===",
            "Active Symptoms: Severe bone pain, massive splenomegaly, chronic fatigue.",
            "Symptom Severity/Mobility: Ambulatory, but experiences frequent bone crises.",
            "Age of Onset: 29 years",
            "",
            "=== 4. LABORATORY BIOMARKERS ===",
            # Intentional missing eGFR and Liver ALT
            "Cardiac Function (Ejection Fraction): 60%",
            "Blood Counts: WBC 3.2K (Leukopenia), RBC 3.8M (Anemia), Platelets 95K (Thrombocytopenia)",
            "",
            "=== 5. MEDICAL & SURGICAL HISTORY ===",
            "Current Medications: Imiglucerase (Cerezyme) infusions.",
            "Past Experimental Trials: Participated in eliglustat trial in 2012.",
            "Transplant History: None.",
            "Comorbidities: Osteopenia.",
            "Surgeries: Splenectomy considered but not performed.",
            "Disability Status: None.",
            "",
            "=== 6. LIFESTYLE FACTORS ===",
            "Substance History: Former smoker (quit 5 years ago).",
            "Allergies: None known."
        ]
    },
    {
        "filename": "patient_03_fabry.pdf",
        "title": "Comprehensive Clinical Note - Patient 03",
        "content": [
            "=== 1. DEMOGRAPHICS & VITALS ===",
            "Age: 29 years",
            "Sex at Birth: Female",
            "Weight: 58 kg",
            "Height: 160 cm",
            "BMI: 22.7",
            "Pregnancy/Lactation Status: Pregnant (First Trimester)",
            "",
            "=== 2. PRIMARY DIAGNOSIS & GENETICS ===",
            "Official Disease Name: Fabry Disease",
            "Date of Diagnosis: 2021-11-05",
            "Genetic Mutation Code: GLA c.644A>G",
            "Family History: Father died of end-stage renal disease secondary to Fabry.",
            "",
            "=== 3. CLINICAL SYMPTOMS ===",
            "Active Symptoms: Severe neuropathic pain (acroparesthesia), decreased sweating (anhidrosis).",
            "Symptom Severity/Mobility: Normal mobility. Pain limits daily activities.",
            "Age of Onset: 14 years",
            "",
            "=== 4. LABORATORY BIOMARKERS ===",
            "Kidney Function (eGFR): 60 mL/min/1.73m2 (Stage 2 CKD)",
            "Liver Function (ALT): 22 U/L",
            "Liver Function (AST): 25 U/L",
            "Cardiac Function (Ejection Fraction): Mild LVH noted. EF 50%.",
            "Blood Counts: Normal.",
            "",
            "=== 5. MEDICAL & SURGICAL HISTORY ===",
            "Current Medications: Agalsidase beta (Fabrazyme), Gabapentin for pain.",
            "Past Experimental Trials: None.",
            "Transplant History: None.",
            "Comorbidities: Proteinuria.",
            "Surgeries: None.",
            "Disability Status: None.",
            "",
            "=== 6. LIFESTYLE FACTORS ===",
            "Substance History: Denies smoking, alcohol, or illicit drug use.",
            "Allergies: NSAIDs (GI upset)."
        ]
    }
]

for patient in patients:
    pdf = FPDF()
    pdf.add_page()
    
    # Add title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt=patient["title"], ln=True, align='C')
    pdf.ln(10)
    
    # Add content
    for line in patient["content"]:
        if line.startswith("==="):
            pdf.set_font("Arial", 'B', 12)
            pdf.multi_cell(0, 8, txt=line)
        else:
            pdf.set_font("Arial", size=11)
            pdf.multi_cell(0, 6, txt=line)
            
    filepath = os.path.join(output_dir, patient["filename"])
    pdf.output(filepath)
    print(f"Generated: {filepath}")

print("All comprehensive sample PDFs generated successfully.")
