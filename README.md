# Aircraft Tracking System

This is a web-based **Aircraft Tracking System** built with **React**, **Leaflet** for mapping, and a **Node.js/Express** backend. The application fetches real aircraft data (from a backend API) and simulates the movement of multiple planes on a map. It also includes fake planes flying in circles to demonstrate movement.

## Features

- Displays real-time positions of aircraft fetched from the backend.
- Simulates 5 fake planes moving in circular patterns on the map.
- Uses **React** for the frontend and **Leaflet** for map rendering.
- Node.js/Express backend for handling aircraft data.
- Periodically fetches data every 5 seconds to update the map in real-time.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [React](https://reactjs.org/) (already installed as part of Create React App)

## Getting Started

### Clone the Repository

First, clone the project repository from GitHub:

```bash
git clone https://github.com/your-username/aircraft-tracking-system.git
cd aircraft-tracking-system
```

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will be running on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```
   The React app will be running on `http://localhost:3000`.

## Project Structure

```bash
aircraft-tracking-system/
├── backend/                # Backend folder (Node.js/Express)
│   ├── models/             # Contains aircraft data models
│   ├── routes/             # Express routes for handling API requests
│   └── index.js            # Entry point for the backend server
├── frontend/               # Frontend folder (React + Leaflet)
│   ├── src/                # React source files
│   └── public/             # Public folder for assets
├── README.md               # This README file
└── package.json            # Project metadata and dependencies
```

## API Endpoints

### Backend API

- **GET** `/api/aircraft`: Fetches the real aircraft data.
- **GET** `/api/test`: A test endpoint for debugging.

### Example Response from `/api/aircraft`:

```json
[
  {
    "flightId": "12345",
    "latitude": 44.8756,
    "longitude": -91.4383,
    "altitude": 10000,
    "speed": 120
  }
]
```

## How the Application Works

### Simulated Aircraft

The application initializes 5 fake planes, each with unique starting positions. These planes move in circular patterns on the map to simulate real aircraft. The positions are updated every 5 seconds using simple trigonometric calculations for circular movement. Each plane has its unique flight path to ensure diversity in movement.

### Real-Time Aircraft Data

The backend periodically fetches and updates aircraft data from a defined source (currently mocked). The real-time data, if available, will be displayed alongside the simulated planes.

## Customization

- **Plane Behavior**: You can customize the movement behavior of the fake planes by adjusting the radius, speed, or other flight characteristics in the code.

- **Backend Data**: You can modify the backend API to fetch real aircraft data from an actual ADS-B source once your hardware setup is in place.

## Future Enhancements

- Integrate real aircraft data using ADS-B receivers.
- Implement filtering and search options to track specific planes.
- Visual improvements and enhanced map interactions.

## License

This project is open-source and available under the MIT License.
