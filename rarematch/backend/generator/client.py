import requests
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import config

def call_laptop2_generator(summary_text, disease="Fabry Disease"):
    """
    Sends a POST request to Laptop 2's API server to generate clinical notes. (Unit 1.5 - API client)
    """
    url = f"{config.LAPTOP_2_API_URL}/generate"
    payload = {
        "disease": disease,
        "summary": summary_text
    }
    
    print(f"Sending note generation request to Laptop 2 ({url})...")
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        if result.get("status") == "success":
            return result.get("clinical_note")
        else:
            print("API responded but generation failed.")
            return None
    except Exception as e:
        print(f"Error connecting to Laptop 2 API: {e}")
        print("Falling back to standard template representation.")
        return f"CLINICAL PROFILE SUMMARY: {summary_text} [Local Connection Fallback]"

if __name__ == "__main__":
    # Test connection
    test_summary = "34yo M diagnosed with Fabry disease presenting with extreme neuropathic pain."
    note = call_laptop2_generator(test_summary)
    print("\n--- Note Received ---")
    print(note)
