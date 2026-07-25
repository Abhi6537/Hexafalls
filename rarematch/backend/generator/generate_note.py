import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def generate_clinician_note(disease="Fabry Disease", summary="Patient presents with symptoms of Fabry Disease"):
    """
    Loads our fine-tuned GPT-2 weights from disk and generates a clinical narrative note. (Unit 1.5)
    If the fine-tuned folder is empty, falls back to using base GPT-2 with direct prompts.
    """
    model_path = config.GPT2_MODEL_DIR
    
    # Check if fine-tuned weights exist in the directory
    if os.path.exists(model_path) and any(f.endswith('.safetensors') or f.endswith('.bin') for f in os.listdir(model_path)):
        print(f"Loading local fine-tuned GPT-2 weights from {model_path}...")
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(model_path)
    else:
        print(f"Fine-tuned weights not found in {model_path} yet.")
        print("Falling back to base GPT-2 model...")
        tokenizer = AutoTokenizer.from_pretrained(config.GPT2_BASE_MODEL)
        model = AutoModelForCausalLM.from_pretrained(config.GPT2_BASE_MODEL)
        
    model.eval()
    
    prompt = (
        f"<|startoftext|>\n"
        f"DISEASE: {disease}\n"
        f"SUMMARY: {summary}\n"
        f"CLINICAL NOTE:\n"
    )
    
    inputs = tokenizer(prompt, return_tensors="pt")
    
    print("Generating note text...")
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=400,
            temperature=0.8,
            top_k=50,
            top_p=0.95,
            do_sample=True,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id
        )
        
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=False)
    
    # Clean output tags
    clean_note = generated_text
    if "CLINICAL NOTE:\n" in clean_note:
        clean_note = clean_note.split("CLINICAL NOTE:\n")[1]
    if "<|endoftext|>" in clean_note:
        clean_note = clean_note.split("<|endoftext|>")[0]
        
    return clean_note.strip()

if __name__ == "__main__":
    note = generate_clinician_note(
        summary="A 34-year-old male with confirmed diagnosis of classic Fabry disease who presented with neuropathic pain in hands and feet."
    )
    print("\n--- Generated Clinical Note narrative (Unit 1.5) ---")
    print(note)
