import os
import requests
import time
import json
import subprocess
import signal
import sys

# URL to fetch aircraft data from dump1090
DUMP1090_URL = "http://192.168.1.94:8080/data.json"

# URL of your main PC's backend server
BACKEND_URL = "http://192.168.1.88:5000/api/aircraft"

dump1090_process = None

# Start dump1090 process
def start_dump1090():
    global dump1090_process
    try:
        print("Starting dump1090...")

        os.chdir('../dump1090')
        dump1090_process = subprocess.Popen(
            ["./dump1090", "--net"],
            stdout=open('dump1090_stdout.log', 'w'),
            stderr=open('dump1090_stderr.log', 'w'))

        print("dump1090 started successfully.")
    except Exception as e:
        print(f"Error starting dump1090: {e}")
        sys.exit(1)  # Exit if dump1090 cannot start

# Fetch aircraft data from dump1090
def fetch_aircraft_data():
    retry_attempts = 5  # Number of times to retry fetching data
    for attempt in range(retry_attempts):
        print(f"Fetching aircraft data (attempt {attempt + 1}/{retry_attempts})...")
        try:
            response = requests.get(DUMP1090_URL, timeout=20)
            response.raise_for_status()  # Raise exception for HTTP errors
            data = response.json()
            print(f"Data fetched successfully: {data}")

            # Return the data if it's a valid list of aircraft
            if isinstance(data, list) and data:
                print("Valid aircraft data found.")
                return data
            else:
                print(f"Empty or invalid aircraft data: {data}")
                return []
        except requests.RequestException as e:
            print(f"Error fetching aircraft data (attempt {attempt + 1}/{retry_attempts}): {e}")
            time.sleep(5)
    print("Failed to fetch aircraft data after retries.")
    restart_dump1090()
    time.sleep(5)
    return []

# Send aircraft data to backend
def send_aircraft_data_to_backend(data):
    if not data:
        print("No valid aircraft data to send to backend.")
        return

    retry_attempts = 5  # Number of retry attempts
    for attempt in range(retry_attempts):
        print(f"Sending data to backend (attempt {attempt + 1}/{retry_attempts})...")
        try:
            response = requests.post(BACKEND_URL, json=data, timeout=15)
            response.raise_for_status()  # Raise an exception for any 4xx/5xx errors
            print("Aircraft data sent successfully")
            return
        except requests.RequestException as e:
            print(f"Error sending aircraft data to backend (attempt {attempt + 1}/{retry_attempts}): {e}")
            time.sleep(5)
    print("Failed to send aircraft data after retries.")

# Restart dump1090 process
def restart_dump1090():
    global dump1090_process
    print("Restarting dump1090...")
    if dump1090_process:
        dump1090_process.terminate()
        dump1090_process.wait()
    start_dump1090()

# Main process to fetch, process, and send aircraft data
def process_and_send_aircraft_data():
    global dump1090_process

    start_dump1090()
    time.sleep(5)

    try:
        while True:

            if dump1090_process.poll() is not None:  # poll() returns None if the process is still running
                print("dump1090 process stopped unexpectedly, restarting...")
                restart_dump1090()
                time.sleep(5)

            print("Fetching and processing aircraft data...")
            aircraft_data = fetch_aircraft_data()

            # Process the data if valid
            if aircraft_data:
                print("Processing fetched aircraft data...")
                formatted_aircraft_data = []
                for aircraft in aircraft_data:
                    if 'lat' in aircraft and 'lon' in aircraft:
                        formatted_aircraft_data.append({
                            "hex": aircraft.get('hex', 'unknown').strip(),
                            "flight": aircraft.get('flight', 'N/A').strip(),
                            "latitude": aircraft['lat'],
                            "longitude": aircraft['lon'],
                            "altitude": aircraft.get('alt_baro', aircraft.get('altitude', 0)),
                            "track": aircraft.get('track', 0),
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

# Clean up and terminate the dump1090 process
def cleanup():
    global dump1090_process
    print("Cleaning up and terminating dump1090...")
    if dump1090_process:
        dump1090_process.terminate()  # Terminate dump1090
        dump1090_process.wait()  # Wait for it to terminate
        print("dump1090 process terminated.")
    sys.exit(0)

# Signal handler to catch interruptions
def signal_handler(sig, frame):
    print("Signal received, stopping the process...")
    cleanup()

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    print("Starting the main process...")
    process_and_send_aircraft_data()