import os
import requests
import time
import json
import subprocess
import signal
import sys

# URL to fetch aircraft data from dump1090
DUMP1090_URL = "http://192.168.1.94:8080/data.json"

# URL of backend server
BACKEND_URL = "http://192.168.1.88:5000/api/aircraft" 

dump1090_process = None

def start_dump1090():
    global dump1090_process
    try:
        print("Starting dump1090...")
        os.chdir('../dump1090') 

        # Run dump1090 as a background process
        dump1090_process = subprocess.Popen(
            ["./dump1090", "--net"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("dump1090 started successfully.")
    except Exception as e:
        print(f"Error starting dump1090: {e}")
        sys.exit(1)

def fetch_aircraft_data():
    retry_attempts = 3 
    for attempt in range(retry_attempts):
        print(f"Fetching aircraft data (attempt {attempt + 1}/{retry_attempts})...")
        try:
            response = requests.get(DUMP1090_URL, timeout=5)  
            response.raise_for_status()  
            data = response.json()
            print(f"Data fetched successfully: {data}") 

            
            if isinstance(data, list) and data:
                print("Valid aircraft data found.")
                return data
            else:
                print(f"Empty or invalid aircraft data: {data}")
                return []
        except requests.RequestException as e:
            print(f"Error fetching aircraft data (attempt {attempt + 1}/{retry_attempts}): {e}")
            time.sleep(2)  
    print("Failed to fetch aircraft data after retries.")
    return []

def send_aircraft_data_to_backend(data):
    if not data:
        print("No valid aircraft data to send to backend.")
        return

    print(f"Sending data to backend: {data}")  
    try:
        response = requests.post(BACKEND_URL, json=data, timeout=5)
        response.raise_for_status() 
        print("Aircraft data sent successfully")
    except requests.RequestException as e:
        print(f"Error sending aircraft data to backend: {e}")

def process_and_send_aircraft_data():
    global dump1090_process

    
    start_dump1090()
    time.sleep(5) 

    try:
        while True:
            print("Fetching and processing aircraft data...")
            
            aircraft_data = fetch_aircraft_data()

            if aircraft_data:
                print("Processing fetched aircraft data...") 
                formatted_aircraft_data = []
                for aircraft in aircraft_data:
                    if 'lat' in aircraft and 'lon' in aircraft:
                        formatted_aircraft_data.append({
                            "flightId": aircraft.get('flight', 'N/A').strip(),
                            "latitude": aircraft['lat'],
                            "longitude": aircraft['lon'],
                            "altitude": aircraft.get('alt_baro', aircraft.get('altitude', 0)), 
                            "speed": aircraft.get('gs', aircraft.get('speed', 0)),  
                        })
                
                send_aircraft_data_to_backend(formatted_aircraft_data)
            else:
                print("No valid aircraft data found to process.")

            print("Sleeping for 15 seconds...") 
            time.sleep(15)  
    except KeyboardInterrupt:
        print("Process interrupted. Cleaning up...")
        cleanup()

def cleanup():
    global dump1090_process
    print("Cleaning up and terminating dump1090...")
    if dump1090_process:
        dump1090_process.terminate() 
        dump1090_process.wait() 
        print("dump1090 process terminated.")
    sys.exit(0)

def signal_handler(sig, frame):
    print("Signal received, stopping the process...")
    cleanup()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    print("Starting the main process...")
    process_and_send_aircraft_data()