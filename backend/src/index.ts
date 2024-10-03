import express from 'express';
const cors = require('cors');
const dotenv = require('dotenv');
// const Aircraft = require('./models/Aircraft');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Define the aircraft data structure
interface Aircraft {
    flightId: string;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
  }

  interface TestCoord {
    latitude: any;
    longitude: any;
  }
  
  // Initialize aircraftList with the correct type
  let aircraftList: Aircraft[] = [];

// Enable CORS
app.use(cors({
    origin: '*',
  }));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// POST route to receive aircraft data
app.post('/api/aircraft', async (req, res) => {
    const { flightId, latitude, longitude, altitude, speed } = req.body;
  
    try {
      // Create a new aircraft object in the database
      const newAircraft: Aircraft = { flightId, latitude, longitude, altitude, speed };
    //   await newAircraft.save(); // Save to MongoDB
  
      res.status(201).json({ message: 'Aircraft data received', newAircraft });
    } catch (error) {
      res.status(500).json({ message: 'Error saving aircraft data', error });
    }
  });

  // GET route to send aircraft data to the frontend
app.get('/api/aircraft', (req, res) => {
    res.status(200).json(aircraftList);  // Send the aircraft list to the frontend
});

app.get('/api/test', (req, res) => {
    const coordinate: TestCoord = { latitude: 44.8756, longitude: -91.4383 };
    res.status(200).json(coordinate);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});