### Aircraft Tracking System

A web-based Aircraft Tracking System built with React, Leaflet for mapping, and a Node.js/Express backend. The system collects real-time aircraft data via an ADS-B antenna connected to a Raspberry Pi and visualizes it on an interactive map. It integrates data collected from local hardware and broadcasts updates to the frontend in real-time using WebSockets.

---

### Project Overview

This project tracks aircraft within a 30-mile radius using ADS-B (Automatic Dependent Surveillance-Broadcast) technology and displays this information on an interactive map. The system comprises:

- **Frontend:** Built with React and Leaflet, providing real-time visualization of aircraft positions and movements.
- **Backend:** Developed with Node.js and Express, handling API requests, data processing, authentication, and real-time data broadcasting via Socket.IO.
- **Hardware Integration:** Utilizes a Raspberry Pi with an ADS-B antenna and a Software Defined Radio (SDR) dongle to capture and send flight data.
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
  - Axios
  - CSS Modules

- **Backend:**

  - Node.js
  - Express
  - TypeScript
  - Socket.IO
  - MongoDB
  - Mongoose
  - Joi (for data validation)
  - Express-Rate-Limit
  - JSON Web Tokens (JWT) for authentication
  - bcrypt for password hashing

- **Hardware:**

  - Raspberry Pi
  - ADS-B Antenna
  - Software Defined Radio (SDR) Dongle
  - dump1090
  - Python

---

### Features

- **Real-Time Aircraft Tracking:** Displays live aircraft positions on an interactive Leaflet map with real-time updates.

- **Aircraft Icons Rotation:** Aircraft icons rotate based on heading to reflect their actual orientation.

- **WebSockets Integration:** Uses Socket.IO to broadcast real-time aircraft data to connected clients, ensuring instantaneous updates without page refreshes.

- **Data Persistence:** Stores aircraft and user information in MongoDB for reliable data management and retrieval. Implements in-memory storage for quick access to active aircraft data.

- **User Authentication:** Implements secure user registration and login using JWT tokens. Passwords are hashed using bcrypt for enhanced security. Protected routes ensure that only authenticated users can access certain features.

- **API Endpoints:** Provides RESTful APIs for fetching, adding, and deleting aircraft data. Includes endpoints for user management (registration and login).

- **Security Measures:** Implements API key authentication for the Raspberry Pi data source. Applies rate limiting to prevent abuse and potential DDoS attacks. Uses Joi for data validation to ensure data integrity.

- **Interactive Map:** Users can click on aircraft markers to view detailed flight information, including flight ID, altitude, speed, heading, and more. Map automatically updates as aircraft move or new aircraft enter the tracking area.

- **Modals and User Interface:** Provides modals for contact information, project details, instructions, and error messages to enhance user experience. Responsive design ensures usability across various devices and screen sizes.

---

### Project Structure

```
aircraft-tracking-system/
├── backend/                 # Backend Node.js server
│   ├── src/
│   │   ├── dao/             # Data Access Objects
│   │   ├── db/              # Database connection
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middlewares/     # Express middlewares (auth, rate limiting)
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic and services
│   │   ├── utils/           # Utility functions
│   │   ├── validation/      # Data validation schemas
│   │   └── server.ts        # Server setup and configuration
|   ├── types
|   |   ├── express.d.ts     # Adds a user token to Express requests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/                # Frontend React app with Leaflet for map rendering
│   ├── src/
│   │   ├── components/      # React components (Map, Login, Signup, etc.)
│   │   ├── service/         # API service functions
│   │   ├── utils/           # Utility functions and custom hooks
│   │   ├── css/             # CSS stylesheets
│   │   ├── App.tsx          # Main React component
│   │   └── index.tsx        # Entry point
│   ├── public/              # Public assets including images
│   ├── package.json
│   └── tsconfig.json
└── raspberry-pi/            # Raspberry Pi Python scripts for data collection
    ├── plane-collect.py     # Python script to fetch aircraft data using dump1090
    ├── dump1090/            # ADS-B decoding software
    │   └── dump1090         # Executable for capturing data via ADS-B antenna
```

---

### Backend API Endpoints

- **User Management:**

  - **POST /api/users:** Registers a new user.
    - **Headers:** Content-Type: application/json
    - **Body:**
      ```
      {
        "username": "your_username",
        "email": "your_email@example.com",
        "password": "your_secure_password"
      }
      ```
  - **POST /api/login:** Authenticates a user and returns a JWT token.
    - **Headers:** Content-Type: application/json
    - **Body:**
      ```
      {
        "username": "your_username",
        "password": "your_secure_password"
      }
      ```

- **Aircraft Data:**

  - **GET /api/plane:** Retrieves the current list of tracked aircraft.

    - **Headers:** Authorization: Bearer <JWT Token>
      ```
      [
        {
          "_id": "6711e8738f6f8ab178c867a0",
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

  - **POST /api/addPlane:** Adds a new aircraft to the tracking system.

    - **Headers:** Content-Type: application/json, x-api-key: your_secure_api_key
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

    - **Headers:** Content-Type: application/json, x-api-key: your_secure_api_key
    - **Body:**
      ```
      [
        {
          "hex": "A123BC",
          "flight": "UA123",
          "latitude": 44.8756,
          "longitude": -91.4383,
          "altitude": 32000,
          "speed": 500,
          "track": 90
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

- **Signal Transmission:** Aircraft equipped with ADS-B broadcast their position, altitude, speed, and heading via radio signals.
- **Signal Reception:** The ADS-B antenna connected to the SDR dongle on the Raspberry Pi captures these signals within a 30-mile radius.

#### Data Collection:

- **Decoding Signals:** dump1090 decodes the ADS-B signals into readable aircraft data.
- **Python Script:** The plane-collect.py script running on the Raspberry Pi fetches this data from dump1090. It processes and sends the data to the backend server via the /api/aircraft endpoint every 15 seconds.

#### Backend Processing:

- **Data Validation and Storage:** The backend server receives aircraft data and validates it using Joi schemas. Valid data is stored in MongoDB and updated in the in-memory aircraftList for quick access.
- **Real-Time Broadcasting:** Socket.IO is used to emit updated aircraft data to all connected frontend clients in real-time. Implements a cleanup function to remove stale aircraft data after a certain period of inactivity.

#### Frontend Visualization:

- **WebSocket Connection:** The React application establishes a WebSocket connection to the backend server to receive real-time aircraft data.
- **Interactive Map:** Leaflet renders the aircraft positions on an interactive map. Aircraft markers rotate based on heading, and clicking on them reveals detailed flight information.

---

### User Interface

- **Includes modals:** Modals are available for instructions, contact information, and error messages.
- **Login and access features:** Users can log in and access additional features, ensuring a personalized experience.

---

### Security Measures

- **API Key Authentication:** Protected endpoints require a valid API key (x-api-key) to prevent unauthorized access, especially for data being sent from the Raspberry Pi.
- **JWT Authentication:** Uses JSON Web Tokens to authenticate users, securing access to protected routes and resources.
- **Rate Limiting:** Applies rate limiting to API endpoints to mitigate potential abuse or DDoS attacks, enhancing overall security.
- **Data Validation and Sanitization:** Validates all incoming data with Joi schemas to ensure it adheres to expected formats. Sanitizes inputs to prevent injection attacks and other security vulnerabilities.
- **Password Security:** Passwords are hashed using bcrypt before storing them in the database, protecting user credentials.

---

### Future Enhancements

- **Extended Range and Coverage:** Improve tracking range by upgrading the antenna or using a more powerful SDR dongle. Network multiple Raspberry Pis to cover a larger geographical area.

- **Historical Data Visualization:** Store flight data over time to visualize historical flight paths and analyze trends. Implement features to replay flight paths or view time-lapse animations.

- **Flight Information Integration:** Integrate with external aviation APIs (e.g., FlightAware, OpenSky Network) to fetch additional flight details like origin, destination, aircraft type, and airline logos.

- **Advanced User Features:** Implement user roles (e.g., admin, user) to manage access to certain features or administrative functions. Allow users to customize the map display, such as filtering by altitude, speed, or specific airlines.

- **Mobile Optimization:** Enhance the frontend for better performance and usability on mobile devices, including touch gestures and responsive layouts.

- **Performance Optimizations:** Implement caching strategies using Redis or in-memory caches to reduce database load. Optimize data broadcasting by only sending updates for changed aircraft.

- **Deployment and Scalability:** Host the application on scalable cloud platforms (e.g., AWS, Heroku, Vercel). Set up continuous integration and deployment pipelines using tools like GitHub Actions or Jenkins. Containerize the application using Docker for consistent deployment environments.

- **Monitoring and Analytics:** Incorporate monitoring tools like Prometheus and Grafana to track application performance. Analyze user interaction to improve the user experience continuously.

---

### Getting Started

1. **Clone the Repository:**

```bash
git clone https://github.com/yourusername/aircraft-tracking-system.git
```

2. **Navigate to the Project Directory:**

```bash
cd aircraft-tracking-system
```

---

### Raspberry Pi Setup

#### Hardware:

1. **ADS-B Antenna and SDR Dongle:**
   - Connect the ADS-B antenna to the SDR dongle.
   - Plug the SDR dongle into one of the Raspberry Pi's USB ports.
2. **Raspberry Pi:**
   - Ensure the Raspberry Pi is connected to your local network via Wi-Fi or Ethernet.
   - Power on the Raspberry Pi and note its IP address for future reference.

---

### Software:

1. **Update System Packages:**

```bash
sudo apt-get update
sudo apt-get upgrade
```

2. Clone the dump1090 repository:

```bash
git clone https://github.com/antirez/dump1090.git
```

- Navigate to the dump1090 directory and build the software:

```bash
cd dump1090
make
sudo make install
```

- Verify installation by running:

```bash
dump1090 --interactive
```

3. **Install Python and Dependencies:**
   - Ensure Python 3 is installed:

```bash
sudo apt-get install python3 python3-pip
```

4. **Configure Environment Variables:**
   - Create a `.env` file in the `raspberry-pi/` directory with the following variables:

```makefile
BACKEND_URL=http://<backend-server-ip>:5000/api/aircraft
PI_API_KEY=your_secure_api_key
```

5. **Run the Python Script:**
   - Navigate to the `raspberry-pi/` directory:

```bash
cd raspberry-pi
```

- Start the data collection script:

```bash
python3 plane-collect.py
```

---

### Backend Setup

1. **Navigate to the Backend Directory:**

```bash
cd backend
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Environment Variables:**
   - Create a `.env` file in the `backend/` directory with the following variables:

```makefile
HTTP_PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
PI_API_KEY=your_secure_api_key
MONGO_URI=your_mongodb_connection_string
```

4. **Start the Backend Server:**

```bash
npm start
```

The backend server will run on `http://localhost:5000` by default.

---

### Frontend Setup

1. **Navigate to the Frontend Directory:**

```bash
cd frontend
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Configure Environment Variables:**
   - Create a `.env` file in the `frontend/` directory with the following variables:

```makefile
REACT_APP_BACKEND_URL=http://localhost:5000/api
```

4. **Start the Frontend Application:**

```bash
npm start
```

The React app will be accessible at `http://localhost:3000`.

---

### Credits

- **Raspberry Pi:** Used for real-time data collection and processing.
- **ADS-B Antenna & SDR Dongle:** Hardware for receiving aircraft signals.
- **Leaflet & OpenStreetMap:** Utilized for rendering interactive maps.
- **dump1090:** Software for decoding ADS-B signals.
- **Socket.IO:** Facilitates real-time communication between the backend and frontend.
- **Inspiration:** Flight tracking platforms like FlightRadar24 and ADS-B Exchange.

---

### Acknowledgements

- Special thanks to the open-source community for providing tools and libraries that made this project possible.
- Gratitude to contributors and testers who provided valuable feedback during development.
