### Aircraft Tracking System

A web-based Aircraft Tracking System built with React, Leaflet for mapping, and a Node.js/Express backend. The system collects real-time aircraft data via an ADS-B antenna connected to a Raspberry Pi and visualizes it on an interactive map. It integrates data collected from local hardware and broadcasts updates to the frontend in real-time using WebSockets.

---

### Project Overview

This project tracks aircraft within a 30-mile radius using ADS-B (Automatic Dependent Surveillance-Broadcast) technology and displays this information on an interactive map. The system comprises:

- **Frontend:** Built with React and Leaflet, providing real-time visualization of aircraft positions.
- **Backend:** Developed with Node.js and Express, handling API requests, data processing, and real-time data broadcasting via Socket.IO.
- **Hardware Integration:** Utilizes a Raspberry Pi with an ADS-B antenna and Software Defined Radio (SDR) dongle to capture and send flight data.
- **Database:** MongoDB is used for data persistence, ensuring reliable storage and retrieval of aircraft information.

Data is refreshed every 10 seconds, ensuring up-to-date tracking of aircraft movements.

---

### Technologies Used

- **Frontend:**

  - React
  - TypeScript
  - Leaflet
  - React-Leaflet
  - Socket.IO Client

- **Backend:**

  - Node.js
  - Express
  - TypeScript
  - Socket.IO
  - MongoDB
  - Mongoose
  - Joi (for data validation)
  - Express-Rate-Limit

- **Hardware:**
  - Raspberry Pi
  - ADS-B Antenna
  - Software Defined Radio (SDR) Dongle
  - dump1090

---

### Features

- **Real-Time Aircraft Tracking:** Displays live aircraft positions on an interactive Leaflet map.
- **WebSockets Integration:** Uses Socket.IO to broadcast real-time aircraft data to connected clients.
- **Data Persistence:** Stores aircraft information in MongoDB for reliable data management.
- **API Endpoints:** Provides RESTful APIs for fetching, adding, and deleting aircraft data.
- **Security Measures:** Implements API key authentication, rate limiting, and data validation to ensure secure operations.
- **Interactive Map:** Users can click on aircraft markers to view detailed flight information, including flight ID, altitude, speed, and heading.
- **Modals for Information:** Provides modals for contact information, project details, and error messages to enhance user experience.

---

### Project Structure

```
aircraft-tracking-system/
├── backend/           # Backend Node.js server
│ ├── src/
│ │ ├── dao/           # Data Access Objects
│ │ ├── db/            # Database connection
| | ├── interfaces/    # Interfaces for object creation
│ │ ├── middlewares/   # Express middlewares
│ │ ├── routes/        # API routes
│ │ ├── services/      # Business logic and services
│ │ ├── utils/         # Utility functions
| | ├── validation/    # Validation utils
│ │ └── server.ts      # Server setup and configuration
│ ├── package.json
│ ├── tsconfig.json
| └── .env
├── frontend/          # Frontend React app with Leaflet for map rendering
│ ├── src/
│ │ ├── service/       # API service functions
│ │ ├── utils/         # Utility functions and sockets
│ │ ├── App.tsx        # Main React component
│ │ └── index.tsx      # Entry point
│ ├── public/          # Public assets for the frontend including images
│ ├── package.json
│ └── tsconfig.json

Raspberry Pi
├── raspberry-pi/      # Raspberry Pi Python scripts for data collection
│ └── plane-collect.py # Python script to fetch aircraft data using dump1090
├── dump1090/          # ADS-B decoding software to capture raw aircraft data
│ └── dump1090         # Executable binary for capturing data via ADS-B antenna
```

---

### Backend API Endpoints

- **GET /api/plane:** Retrieves the current list of tracked aircraft.

```
{
  "icao": "A123BC",
  "flight": "UA123",
  "altitude": 32000,
  "speed": 500,
  "timestamp": "2024-04-27T12:34:56Z",
  "country": "USA",
  "airline": "Boeing 747"
  "_id": "6711e8738f6f8ab178c867a0"
}
```

- **POST /api/addPlane:** Adds a new aircraft to the tracking system.
  - **Headers:**
    - Content-Type: application/json
    - x-api-key: your_secure_api_key
  - **Body:**

```
{
  "icao": "A123BC",
  "flight": "UA123",
  "altitude": 32000,
  "speed": 500,
  "timestamp": "2024-04-27T12:34:56Z",
  "country": "USA",
  "airline": "Boeing 747"
}
```

- **POST /api/aircraft:** Adds or updates aircraft data in bulk, typically sent from the Raspberry Pi.
  - **Headers:**
    - Content-Type: application/json
    - x-api-key: your_secure_api_key
  - **Body:**

```
[
  {
    "icao": "A123BC",
    "flight": "UA123",
    "latitude": 44.8756,
    "longitude": -91.4383,
    "altitude": 32000,
    "speed": 500,
    "heading": 90,
    "lastUpdate": 1616161616161
  },
  ...
]
```

- **DELETE /api/aircraft/:icao:** Deletes an aircraft based on its ICAO code.

  - **Headers:**
    - x-api-key: your_secure_api_key

- **DELETE /api/aircraft/id/:id:** Deletes an aircraft based on its unique ID in the database.
  - **Headers:**
    - x-api-key: your_secure_api_key

---

### How the Application Works

#### ADS-B Technology:

- Aircraft equipped with ADS-B transmit their position, altitude, speed, and heading via radio signals.
- The ADS-B antenna connected to the SDR dongle on the Raspberry Pi captures these signals.

#### Data Collection:

- dump1090 decodes the ADS-B signals into readable aircraft data.
- The Python script (plane-collect.py) running on the Raspberry Pi fetches this data and sends it to the backend server via the /api/aircraft endpoint every 15 seconds.

#### Backend Processing:

- The backend server receives aircraft data, validates it using Joi schemas, and updates the MongoDB database.
- In-memory storage (aircraftList) is maintained for quick access and real-time broadcasting.
- Socket.IO is used to emit updated aircraft data to all connected frontend clients in real-time.

#### Frontend Visualization:

- The React application connects to the backend server via WebSockets to receive real-time aircraft data.
- Leaflet renders the aircraft positions on an interactive map.
- Users can click on aircraft markers to view detailed information such as flight ID, altitude, speed, and heading.

### Security Measures

#### API Key Authentication:

- Protected endpoints require a valid API key (`x-api-key`) to prevent unauthorized access.

#### Rate Limiting:

- Limits the number of requests per IP to mitigate potential abuse or DDoS attacks.

#### Data Validation:

- Ensures that incoming data adheres to defined schemas to prevent malformed or malicious data from being processed.

---

### Security Considerations to improve on

#### Environment Variables:

- Ensure that the `.env` files are excluded from version control (e.g., added to `.gitignore`) to protect sensitive information like API keys and database credentials.

#### CORS Configuration:

- The backend is configured to accept requests only from `http://localhost:3000`. Update this in production to include your frontend's actual domain.

```javascript
app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your frontend's domain in production
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);
```

#### HTTPS:

- Implement HTTPS in production to secure data in transit between clients and the server.

#### Input Sanitization:

- Beyond Joi validation, ensure that all inputs are sanitized to prevent injection attacks.

---

### Future Enhancements

#### Extended Range:

- Improve tracking range by upgrading the antenna or using a more powerful SDR dongle.

#### Historical Data Visualization:

- Store flight data in the database to visualize historical flight paths and trends over time.

#### Flight Information Integration:

- Integrate with external APIs (e.g., FlightAware) to fetch additional flight details like origin and destination.

#### User Authentication & Authorization:

- Implement user accounts with roles to manage permissions and access to certain features.

#### Mobile Optimization:

- Enhance the frontend for better performance and usability on mobile devices.

#### Performance Optimizations:

- Implement caching strategies and optimize data broadcasting to handle larger volumes of data efficiently.

#### Deployment:

- Host the application on cloud platforms (e.g., AWS, Heroku, Vercel) and set up continuous integration and deployment pipelines.

---

### Getting Started

#### Clone the Repository:

```bash
git clone https://github.com/yourusername/aircraft-tracking-system.git
```

#### Navigate to the Project Directory:

```bash
cd aircraft-tracking-system
```

#### Raspberry Pi Setup

**Hardware:**

1. **ADS-B Antenna:**

   - Connect the ADS-B antenna to the SDR dongle.
   - Plug the SDR dongle into the Raspberry Pi's USB port.

2. **Raspberry Pi:**
   - Ensure the Raspberry Pi is connected to your local network via Wi-Fi or Ethernet.
   - Power on the Raspberry Pi.

**Software:**

1. **Install dump1090:**
   - Clone the dump1090 repository:

```
git clone https://github.com/antirez/dump1090.git
```

- Navigate to the dump1090 directory and build the software:

```
     cd dump1090
     make
     sudo make install
```

- Verify installation by running:

```
     dump1090 --interactive
```

2. **Install Python Dependencies:**
   - Ensure Python is installed on the Raspberry Pi.
   - Install required Python packages:

```
     pip install requests
```

3. **Configure Environment Variables:**
   - Create a .env file in the raspberry-pi/ directory with the following variables:

```
   BACKEND_URL=http://<backend-server-ip>:5000/api/aircraft
   PI_API_KEY=your_secure_api_key
```

4. **Run the Python Script:**
   - Navigate to the raspberry-pi/ directory:

```
     cd raspberry-pi
```

- Start the data collection script:

```
     python plane-collect.py
```

---

#### Backend Setup

1. **Navigate to the Backend Directory:**

```
   cd backend
```

2. **Install Dependencies**:

```
npm install
```

3. **Configure Environment Variables**:
   - Create a .env file in the backend/ directory with the following variables:

```
   HTTP_PORT=5000
   NODE_ENV=development
   PI_API_KEY=your_secure_api_key
   MONGO_URI=your_mongodb_connection_string
```

4. **Start the Backend Server**:

```
npm start
```

The backend server will run on http://localhost:5000 by default.

#### Frontend Setup

1. **Navigate to the Frontend Directory**:

```
cd frontend
```

2. **Install Dependencies**:

```
npm install
```

3. **Configure Environment Variables**:
   - Create a .env file in the frontend/ directory with the following variables:

```
REACT_APP_BACKEND_URL=http://localhost:5000/api
```

4. **Start the Frontend Application**:

```
npm start
```

The React app will be accessible at http://localhost:3000.

---

### Licenses and Credits

- **Raspberry Pi:** Used for real-time data collection and processing.
- **ADS-B Antenna & SDR Dongle:** Hardware for receiving aircraft signals.
- **Leaflet & OpenStreetMap:** Utilized for rendering interactive maps.
- **dump1090:** Software for decoding ADS-B signals.
- **Socket.IO:** Facilitates real-time communication between the backend and frontend.
- **Inspiration:** Flight tracking platforms like FlightRadar24.
