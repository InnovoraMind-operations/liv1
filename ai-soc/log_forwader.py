import time
import requests
import os

# Configuration
TARGET_LOG_FILE = "mock_auth.log"
API_URL = "http://localhost:8000/api/alerts/analyze"

def forward_log(log_line: str):
    """Sends the raw log string to the autonomous SOC agent webhook."""
    payload = {"raw_log": log_line.strip()}
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        if response.status_code == 200:
            print(f"[✓] Successfully forwarded log. Agent Triage: {response.json().get('severity', 'UNKNOWN')}")
        else:
            print(f"[✗] Failed to forward log. Server responded with: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[!] Connection Error: Unable to reach the backend API. {e}")

def watch_log_file(file_path: str):
    """Continuously tails the log file, watching for new lines."""
    print(f"[*] Starting Log Monitor. Watching target file: '{file_path}'...")
    
    # Ensure the file exists so the script doesn't crash on startup
    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write("")
            
    with open(file_path, "r") as file:
        # Move the cursor to the current end of the file so we only read new inputs
        file.seek(0, os.SEEK_END)
        
        while True:
            line = file.readline()
            if not line:
                # No new line found, pause briefly to prevent high CPU utilization
                time.sleep(0.5)
                continue
            
            # Filter for high-value security events (Optional optimization)
            if "Failed" in line or "Accepted" in line or "invalid" in line.lower():
                print(f"[!] Security-relevant line detected: {line.strip()}")
                forward_log(line)
            else:
                print(f"[*] Skipping non-security log line.")

if __name__ == "__main__":
    try:
        watch_log_file(TARGET_LOG_FILE)
    except KeyboardInterrupt:
        print("\n[*] Log Monitor stopped safely.")