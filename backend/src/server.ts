import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db';  // Import DB connection
import aircraftRoutes from './routes/aircraftRoutes';
import { handleAircraftSocketConnection } from './service/backendSocket';
import { removeInactiveAircraft } from './service/aircraftService';

dotenv.config();

const app = express();
const HTTP_PORT = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT, 10) : 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Create HTTP server and integrate with Socket.io
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
  },
});

// Set up routes
app.use('/api', aircraftRoutes(io));

// Handle WebSocket connections
io.on('connection', (socket) => handleAircraftSocketConnection(socket));

// Start cleanup function to remove stale aircraft every 15 seconds
const CLEANUP_INTERVAL = 15000; // 15 seconds
const MAX_IDLE_TIME = 15000; // 15 seconds
setInterval(() => removeInactiveAircraft(MAX_IDLE_TIME, io), CLEANUP_INTERVAL);

// Connect to MongoDB
connectDB();

// Start the HTTP and WebSocket server
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP and WebSocket server is running on http://localhost:${HTTP_PORT}`);
});