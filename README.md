# Aircraft Tracking System

A web-based aircraft tracking system built with React, Leaflet, and a Node.js backend. The application receives real-time aircraft data from a Raspberry Pi equipped with an ADS-B antenna and displays it on an interactive map. The system integrates local hardware with a web frontend using WebSockets for real-time updates.

---

## Project Overview

This project tracks aircraft within a 30-mile radius using ADS-B (Automatic Dependent Surveillance–Broadcast) signals. The system consists of:

- A React frontend with Leaflet for real-time aircraft visualization  
- A Node.js backend for data processing, WebSocket broadcasting, and user authentication  
- A Raspberry Pi with an SDR dongle and ADS-B antenna to capture aircraft data  
- MongoDB for storing aircraft and user information  

Aircraft data is updated every 10 seconds to maintain near real-time accuracy.

---

## Features

- Real-time aircraft position updates over WebSocket connections  
- Interactive Leaflet map with aircraft icons that rotate to match heading  
- Clickable markers display flight details such as ID, altitude, speed, and direction  
- User authentication with JWT tokens and bcrypt-hashed passwords  
- RESTful API for aircraft data access and management  
- Secure API key validation for Raspberry Pi transmissions  
- Rate limiting and input validation for backend protection  
- Responsive UI with modal dialogs for instructions and error messages  
- In-memory aircraft caching with automatic cleanup of stale records

---

## Technologies Used

### Frontend

- React  
- TypeScript  
- Leaflet and React-Leaflet  
- Socket.IO client  
- Axios  
- CSS Modules

### Backend

- Node.js  
- Express  
- TypeScript  
- Socket.IO  
- MongoDB with Mongoose  
- JWT authentication  
- Joi validation  
- Express Rate Limit  
- bcrypt for password hashing

### Hardware

- Raspberry Pi  
- Software Defined Radio (SDR) dongle  
- ADS-B antenna  
- dump1090  
- Python scripts

---

## Project Structure

```
aircraft-tracking-system/
├── backend/
│   ├── src/
│   │   ├── dao/
│   │   ├── db/
│   │   ├── interfaces/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validation/
│   │   └── server.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── service/
│   │   ├── utils/
│   │   ├── css/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── raspberry-pi/
    ├── plane-collect.py
    └── dump1090/
        └── dump1090
```

---

## Backend API Overview

- **POST /api/users**  
  Registers a new user

- **POST /api/login**  
  Returns a JWT token on valid credentials

- **GET /api/plane**  
  Returns the current list of tracked aircraft (JWT required)

- **POST /api/addPlane**  
  Adds a single aircraft (requires API key)

- **POST /api/aircraft**  
  Adds or updates multiple aircraft (used by Raspberry Pi)

- **DELETE /api/aircraft/:icao**  
  Deletes an aircraft using its ICAO code

- **DELETE /api/aircraft/id/:id**  
  Deletes an aircraft using its database ID

---

## How the System Works

The Raspberry Pi receives ADS-B signals using an antenna and SDR dongle. dump1090 decodes these signals into aircraft data, which is processed by a Python script and sent to the backend via HTTP.

The backend stores validated data in MongoDB and updates a live in-memory list of active aircraft. Using WebSockets, the server broadcasts aircraft updates to connected frontend clients in real time.

The React frontend renders this data on an interactive map using Leaflet. Aircraft markers are clickable and rotate to match the current heading, with flight details shown in a modal. Authentication is handled via JWT tokens, and users must log in to access protected features.

---

## Research Summary

This project demonstrates how low-cost hardware, real-time web technologies, and air traffic data can be combined to create a functioning aircraft tracking system. By integrating ADS-B signal reception, real-time data streaming, and secure user management, the system delivers a responsive flight tracking interface suitable for local monitoring or educational use. It also serves as a case study in full-stack application design with hardware data collection, live network communication, and web visualization.

