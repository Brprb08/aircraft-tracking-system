# Aircraft Tracking System

This is a web-based **Aircraft Tracking System** built with **React**, **Leaflet** for mapping, and a **Node.js/Express** backend. The system collects real-time aircraft data via an ADS-B antenna connected to a Raspberry Pi and visualizes it on a map. It integrates data collected from local hardware and simulates aircraft movement on the frontend map.

## Project Overview

This project tracks aircraft within a 30-mile radius using **ADS-B (Automatic Dependent Surveillance-Broadcast)** technology and displays this information on an interactive map. The system includes a **frontend (React/Leaflet)** for visualization, a **backend (Node.js/Express)** to handle API requests, and a Raspberry Pi with an ADS-B antenna that collects flight data. The data is refreshed every 10 seconds, ensuring real-time tracking.

## Equipment Used

1. Raspberry Pi:

   - A small single-board computer used to run dump1090 to capture ADS-B signals and send flight data to the backend.
   - Setup includes Python scripts for fetching and processing the aircraft data.

2. ADS-B Antenna:

   - Used to capture signals broadcast by nearby planes.
   - Allows for a maximum range of approximately 30 miles from the antenna's location.

3. Software Defined Radio (SDR) Dongle:

   - A USB dongle that acts as the receiver to collect radio frequencies from ADS-B-equipped aircraft.
   - Paired with dump1090 to convert the received radio signals into readable data.

4. Frontend:

   - Built using React and Leaflet, it displays real-time aircraft positions on an interactive map.
   - Users can click on aircraft to view details like flight ID, altitude, and speed.

5. Backend:
   - Developed in Node.js with Express, it receives data from the Raspberry Pi, processes it, and serves it to the frontend via a REST API.

## Features

- **Real-Time Aircraft Tracking**: The map displays real-time aircraft positions based on data captured by the Raspberry Pi.
- **Simulated Aircraft**: Optionally includes simulated aircraft to demonstrate real-time data visualization and plane movements.
- **Raspberry Pi Integration**: A Python script running on the Raspberry Pi collects and sends aircraft data to the backend.
- **Map Interactivity**: Click on planes to view more detailed flight information, including altitude, speed, and flight ID.

## Project Structure

```bash
   aircraft-tracking-system/
   ├── backend/           # Backend Node.js server
   │  └── index.ts        # Server setup, API handling, aircraft data processing
   ├── frontend/          # Frontend React app with Leaflet for map rendering
   │ ├── src/             # Main React app components and styles
   │ └── public/          # Public assets for the frontend
   ├── raspberry-pi/      # Raspberry Pi Python scripts for data collection
   │ └── plane-collect.py # Python script to fetch aircraft data using dump1090
   ├── dump1090/          # ADS-B decoding software to capture raw aircraft data
   │ └── dump1090         # Executable binary for capturing data via ADS-B antenna
   └── README.md          # This README file
```

## Equipment Setup Instructions

### Raspberry Pi Setup

1. Hardware:

   - Attach the ADS-B antenna to the SDR dongle and plug it into the Raspberry Pi.
   - Ensure the Raspberry Pi is connected to your local network (Wi-Fi or Ethernet).

2. Software:

   - Install dump1090: This software decodes ADS-B signals.
   - Install via the github (https://github.com/antirez/dump1090) and follow README for setup
   - Run the Python script: The script continuously collects aircraft data and sends it to the backend.
   - python plane-collect.py

3. Start Data Collection
   - After setup, the Python script (plane-collect.py) will start fetching aircraft data and sending it to your backend server.

### Backend Setup

1. Navigate to the backend/ folder:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

#### Backend API Endpoints

- GET /api/aircraft: Returns the current aircraft data stored in the backend.
- POST /api/aircraft: Receives updated aircraft data from the Raspberry Pi.

### Frontend Setup

1. Navigate to the frontend/ folder:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm start
   ```

The React app will be accessible at http://localhost:3000.

### Python Code on Raspberry Pi

The Python script located in the raspberry-pi/ folder handles:

- **Starting dump1090**: It collects raw ADS-B data.
- **Fetching aircraft data**: Queries the dump1090 local server (http://192.168.1.94:8080/data.json) to get aircraft information.
- **Sending data to backend**: Sends aircraft data to the backend API every 15 seconds.

To run the script:

```bash
python plane-collect.py
```

## How the Application Works

### ADS-B Technology:

- ADS-B is a surveillance technology that allows aircraft to broadcast their position, altitude, and speed via radio signals.
- The Raspberry Pi, combined with an SDR dongle and ADS-B antenna, receives these signals and passes the data to the backend.

### Frontend Visualization:

- The frontend React app fetches the aircraft data from the backend every 5 seconds and displays it on a Leaflet map.
- Users can interact with the map by clicking on planes to view detailed flight information.

### Backend Processing:

- The backend receives data from the Raspberry Pi, processes it, and stores it in an in-memory array (aircraftList).
- The frontend fetches this data from the backend via API calls.

## Future Enhancements

- Extended Range: Improve range by upgrading the antenna or SDR dongle.
- Historical Data: Store flight data in a database to visualize flight paths over time.
- Flight Information: Integrate external APIs (like FlightAware) to fetch flight origin/destination details.
- Mobile Optimization: Improve the user experience on mobile devices.

## Licenses and Credits

- Raspberry Pi: Used for real-time data collection.
- ADS-B Antenna and SDR Dongle: Hardware for receiving aircraft signals.
- Leaflet & OpenStreetMap: Used for rendering real-time maps.
- Inspiration: Flight tracking platforms like FlightRadar24.
