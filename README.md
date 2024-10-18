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
  - Helmet (for security)
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

aircraft-tracking-system/
├── backend/ # Backend Node.js server
│ ├── src/
│ │ ├── controllers/ # Route handlers
│ │ ├── dao/ # Data Access Objects
│ │ ├── middlewares/ # Express middlewares
│ │ ├── routes/ # API routes
│ │ ├── services/ # Business logic and services
│ │ ├── utils/ # Utility functions
│ │ └── index.ts # Server setup and configuration
│ ├── package.json
│ └── tsconfig.json
├── frontend/ # Frontend React app with Leaflet for map rendering
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # API service functions
│ │ ├── utils/ # Utility functions and hooks
│ │ ├── App.tsx # Main React component
│ │ └── index.tsx # Entry point
│ ├── public/ # Public assets for the frontend
│ ├── package.json
│ └── tsconfig.json
├── raspberry-pi/ # Raspberry Pi Python scripts for data collection
│ └── plane-collect.py # Python script to fetch aircraft data using dump1090
├── dump1090/ # ADS-B decoding software to capture raw aircraft data
│ └── dump1090 # Executable binary for capturing data via ADS-B antenna
├── .env # Environment variables (ensure this is excluded from version control)
└── README.md # This README file

gh the provided contact information in the project's repository.

---

### Backend API Endpoints

- **GET /api/plane:** Retrieves the current list of tracked aircraft.

- **POST /api/addPlane:** Adds a new aircraft to the tracking system.
  - **Headers:**
    - Content-Type: application/json
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

  - **Headers:** x-api-key: your_secure_api_key

- **DELETE /api/aircraft/id/:id:** Deletes an aircraft based on its unique ID in the database.
  - **Headers:** x-api-key: your_secure_api_key

---

### How the Application Works

#### ADS-B Technology:

- Aircraft equipped with ADS-B transmit their position, altitude, speed, and heading via radio signals.
- The ADS-B antenna connected to the SDR dongle on the Raspberry Pi captures these signals.

#### Data Collection:

- dump1090 decodes the ADS-B signals into readable aircraft data.
- The Python script (plane-collect.py) fetches this data and sends it to the backend server via the /api/aircraft endpoint every 15 seconds.

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

### Security Considerations

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

#### Helmet Middleware:

- Enhances security by setting various HTTP headers.

```javascript
import helmet from 'helmet';
app.use(helmet());
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

### Licenses and Credits

- **Raspberry Pi:** Used for real-time data collection and processing.
- **ADS-B Antenna & SDR Dongle:** Hardware for receiving aircraft signals.
- **Leaflet & OpenStreetMap:** Utilized for rendering interactive maps.
- **dump1090:** Software for decoding ADS-B signals.
- **Socket.IO:** Facilitates real-time communication between the backend and frontend.
- **Inspiration:** Flight tracking platforms like FlightRadar24.

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

#### Set Up the Backend:

- Follow the Backend Setup instructions.

#### Set Up the Frontend:

- Follow the Frontend Setup instructions.

#### Set Up the Raspberry Pi:

- Follow the Raspberry Pi Setup instructions.
