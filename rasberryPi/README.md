## Raspberry Pi Data Collection

This directory contains the code that runs on the Raspberry Pi to collect flight data via an ADS-B antenna and sends it to the backend server.

### Setup Instructions

1. Clone this repository on your Raspberry Pi.
2. Navigate to the `raspberry-pi/` directory.
3. Install required dependencies (Python, libraries, etc.).
4. Configure the backend server's IP address in the config file.
5. Run the `collect.py` script to start collecting data.

### Dependencies

- Python 3
- `requests` library for sending data to the backend
- Other relevant libraries

### Running the Code

bash
python collect.py

### 4. **Version Control for Raspberry Pi Code**

- If the Raspberry Pi code is a separate, standalone project, you might want to ensure that it still follows **good version control practices**.
- Make sure to commit this new code structure to your existing repo:
  ```bash
  git add raspberry-pi/
  git commit -m "Add Raspberry Pi data collection code"
  git push origin main
  ``
  ```

### 5. **(Optional) Use a Branch for the Raspberry Pi Code**

- If you want to **keep the Raspberry Pi code isolated** from the main frontend/backend work, you could even create a separate branch just for the Raspberry Pi:
  ```bash
  git checkout -b raspberry-pi-code
  ```
- Then push the changes to that branch:
  ```bash
  git add raspberry-pi/
  git commit -m "Add Raspberry Pi data collection code"
  git push origin raspberry-pi-code
  ```
- This is useful if you want to **keep the main project clean** and maintain the Pi code separately.
