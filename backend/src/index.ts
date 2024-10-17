import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Define ports using environment variables or defaults
const HTTP_PORT: number = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 5000;

// Aircraft interface with all necessary properties
interface Aircraft {
  icao: string;           // Unique identifier, mapped from 'hex'
  flight: string;      // Flight identifier, mapped from 'flight'
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  lastUpdate: number;    // Timestamp of the last update
  prevLatitude?: number; // Previous latitude for heading calculation
  prevLongitude?: number;// Previous longitude for heading calculation
}

// In-memory list to store aircraft data
let aircraftList: Aircraft[] = [];

// Middleware setup
// const allowedOrigins = ['https://www.yourdomain.com']; // Replace with your actual frontend URL

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ['GET', 'POST'],
//   credentials: true,
// }));
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Create HTTP server and integrate with Socket.io
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Allow only your frontend's origin
  },
});

// Function to calculate bearing between two geographical points
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const diffLong = toRadians(lon2 - lon1);

  const x = Math.sin(diffLong) * Math.cos(lat2Rad);
  const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(diffLong);

  let initialBearing = Math.atan2(x, y);
  initialBearing = (initialBearing * 180) / Math.PI;
  const compassBearing = (initialBearing + 360) % 360;

  return compassBearing;
};

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://peltobrendan:@uwecSwimmer2024@plane-tracking.erjau.mongodb.net/?retryWrites=true&w=majority&appName=Plane-Tracking';
// mongoose.connect(mongoURI)
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => {
//   console.error('Failed to connect to MongoDB:', err);
//   process.exit(1);
// });

// Cleanup function to remove stale aircraft
const CLEANUP_INTERVAL = 15000; // 15 seconds
const MAX_IDLE_TIME = 15000;    // 15 seconds

setInterval(() => {
  const currentTime = Date.now();
  const initialLength = aircraftList.length;
  aircraftList = aircraftList.filter(aircraft => {
    const isActive = currentTime - aircraft.lastUpdate < MAX_IDLE_TIME;
    if (!isActive) {
      console.log(`Removing inactive aircraft: ${aircraft.flight} (${aircraft.icao})`);
    }
    return isActive;
  });
  if (aircraftList.length !== initialLength) {
    io.emit('aircraftData', aircraftList);
  }
}, CLEANUP_INTERVAL);

// Handle WebSocket connections
io.on('connection', (socket: Socket) => {
  console.log('Client connected via WebSocket');

  // Send current aircraft data upon connection
  socket.emit('aircraftData', aircraftList);

  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
  });
});

// Optional GET route to fetch aircraft data via HTTP
app.get('/api/aircraft', (req: Request, res: Response) => {
  console.log('Sending aircraft data:', aircraftList);
  res.status(200).json(aircraftList);
});

// API Key Authentication Middleware
const authenticatePi = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.PI_API_KEY; // Ensure this is set in your .env
  console.log(req.headers['x-api-key']);

  if (apiKey === validApiKey) {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
};

// Define rate limiter for the POST /api/aircraft route
const piRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100,             // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// POST route to update aircraft data
app.post('/api/aircraft', piRateLimiter, authenticatePi, (req: Request, res: Response) => {
  const newData = req.body;
  if (Array.isArray(newData)) {
    const currentTime = Date.now();
    newData.forEach((entry, index) => {
      // Extract fields with fallback options
      const icao = entry.hex?.trim() || entry.flight?.trim(); // Fallback to 'flightId' if 'hex' is missing
      const flight = entry.flight?.trim() || entry.flight?.trim() || 'N/A';
      const latitude = entry.lat ?? entry.latitude;
      const longitude = entry.lon ?? entry.longitude;
      const altitude = entry.altitude;
      const speed = entry.speed || 0;
      const heading = entry.track ?? entry.heading ?? 0;

      // Validate essential fields
      if (!icao) {
        console.warn(`Skipping aircraft at index ${index} with undefined ICAO: ${JSON.stringify(entry)}`);
        return; // Skip this entry
      }

      if (latitude === undefined || longitude === undefined || altitude === undefined) {
        console.warn(`Skipping aircraft at index ${index} due to missing fields: ${JSON.stringify(entry)}`);
        return; // Skip this entry
      }

      const existingIndex = aircraftList.findIndex(a => a.icao === icao);
      if (existingIndex !== -1) {
        const existingAircraft = aircraftList[existingIndex];
        const calculatedHeading = calculateBearing(existingAircraft.latitude, existingAircraft.longitude, latitude, longitude);

        // Update existing aircraft
        aircraftList[existingIndex] = {
          ...existingAircraft,
          flight,
          latitude,
          longitude,
          altitude,
          speed,
          heading: calculatedHeading || heading, // Use calculated heading or incoming track
          lastUpdate: currentTime,
          prevLatitude: existingAircraft.latitude,
          prevLongitude: existingAircraft.longitude,
        };
        console.log(`Updated aircraft via POST: ${flight} (${icao}) with heading: ${aircraftList[existingIndex].heading}`);
      } else {
        // Add new aircraft
        const newAircraft: Aircraft = {
          icao,
          flight,
          latitude,
          longitude,
          altitude,
          speed,
          heading,
          lastUpdate: currentTime,
        };
        aircraftList.push(newAircraft);
        console.log(`Added new aircraft via POST: ${flight} (${icao})`);
      }
    });

    // Emit updated aircraft list after processing all entries
    io.emit('aircraftData', aircraftList);

    res.status(200).json({ message: 'Aircraft data updated successfully' });
  } else {
    res.status(400).json({ error: 'Invalid data format. Expected an array of aircraft objects.' });
  }
});

// Start the HTTP and WebSocket server on port 5000
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`HTTP and WebSocket server is running on http://localhost:${HTTP_PORT}`);
});