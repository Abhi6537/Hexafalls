import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def format_case_reports_for_gpt2():
    """
    Reads the downloaded PubMed case reports and formats them into instruction-style 
    training prompts to teach GPT-2 how to translate structured symptoms into doctor notes. (Unit 1.3)
    """
    cleaned_path = config.CASE_REPORTS_DIR / "cleaned_patient_notes.json"
    if not cleaned_path.exists():
        print(f"Error: {cleaned_path} does not exist. Run run_pipeline.py first.")
        return
        
    with open(cleaned_path, "r", encoding="utf-8") as f:
        case_reports = json.load(f)
        
    print(f"Formatting {len(case_reports)} case reports into GPT-2 prompt templates...")
    training_prompts = []
    
    for report in case_reports:
        title = report.get("title", "")
        note = report.get("clinical_note", "")
        
        # Build prompt template:
        # Input: Disease + Title/Focus
        # Target: Coherent Clinical Note
        prompt_text = (
            f"<|startoftext|>\n"
            f"DISEASE: Fabry Disease\n"
            f"SUMMARY: {title}\n"
            f"CLINICAL NOTE:\n"
            f"{note}\n"
            f"<|endoftext|>\n"
        )
        training_prompts.append({"text": prompt_text})
        
    output_path = config.TRAINING_DIR / "gpt2_training_prompts.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(training_prompts, f, indent=2, ensure_ascii=False)
        
    # Also save as plain text line-by-line format for easy training load
    text_path = config.TRAINING_DIR / "gpt2_training_text.txt"
    with open(text_path, "w", encoding="utf-8") as f:
        for item in training_prompts:
            f.write(item["text"] + "\n")
            
    print(f"Saved formatted prompts to {output_path} and text corpus to {text_path}")
    return training_prompts

if __name__ == "__main__":
    prompts = format_case_reports_for_gpt2()
    if prompts:
        print(f"Verified prompt formatting. Sample length: {len(prompts[0]['text'])} characters.")
