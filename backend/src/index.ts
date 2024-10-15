import net, { Socket } from 'net';
import express, { Request, Response } from 'express';
const cors = require('cors');

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

interface Aircraft {
  flightId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
}

let aircraftList: Aircraft[] = [];

// Enable CORS
app.use(cors({ origin: '*' }));
app.use(express.json());

// Optionally, keep the existing SBS TCP server
const server = net.createServer((socket: Socket) => {
  console.log('Client connected');

  socket.on('data', (data: Buffer) => {
    const dataString = data.toString();
    console.log('Data received:', dataString);

    const lines = dataString.split('\n');
    lines.forEach((line: string) => {
      const parts = line.split(',');

      // Check if the message is a position report (MSG,3) and has lat/lon
      if (parts[0] === 'MSG' && parts[1] === '3' && parts[14] && parts[15]) {
        console.log(`Processing data line: ${line}`);
        const aircraft: Aircraft = {
          flightId: parts[10].trim() || 'N/A', // flight ID or 'N/A' if empty
          latitude: parseFloat(parts[14]),    // Latitude from the message
          longitude: parseFloat(parts[15]),   // Longitude from the message
          altitude: parseInt(parts[11], 10),  // Barometric altitude
          speed: parseInt(parts[12], 10) || 0 // Ground speed (default to 0 if missing)
        };

        console.log('Parsed aircraft data:', aircraft);

        // Add new aircraft or update existing one
        const existingAircraftIndex = aircraftList.findIndex(a => a.flightId === aircraft.flightId);
        if (existingAircraftIndex > -1) {
          aircraftList[existingAircraftIndex] = aircraft;
          console.log(`Updated aircraft: ${aircraft.flightId}`);
        } else {
          aircraftList.push(aircraft);
          console.log(`Added new aircraft: ${aircraft.flightId}`);
        }
      }
    });
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// server.listen(5000, '0.0.0.0', () => {
//   console.log('Listening for SBS data on port 30003...');
// });

// Existing GET route
app.get('/api/aircraft', (req: Request, res: Response) => {
  console.log('Sending aircraft data:', aircraftList);
  res.status(200).json(aircraftList);
});

// New POST route
app.post('/api/aircraft', (req: Request, res: Response) => {
  const newData = req.body;
  if (Array.isArray(newData)) {
    aircraftList = newData;
    console.log('Aircraft data updated via POST');
    res.status(200).json({ message: 'Aircraft data updated successfully' });
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});