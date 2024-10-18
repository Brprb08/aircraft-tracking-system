import { Request, Response } from 'express';
import { AircraftModel } from '../dao/aircraftDAO';
import { aircraftValidationSchema } from '../validation/aircraftValidation';
import { userValidationSchema } from '../validation/userValidation';
import { Aircraft } from '../interfaces/aircraft';
import { Server as SocketIOServer } from 'socket.io';
import bcrypt from 'bcrypt';
import User from '../dao/userDAO';
import jwt from 'jsonwebtoken';

// In-memory list to store aircraft data
let aircraftList: Aircraft[] = [];

// Remove old aircraft based on last update time
export const removeInactiveAircraft = (maxIdleTime: number, io: SocketIOServer) => {
  const currentTime = Date.now();
  aircraftList = aircraftList.filter(aircraft => currentTime - aircraft.lastUpdate < maxIdleTime);
  
  // Emit updated list to all clients
  io.emit('aircraftData', aircraftList);
};

// Get all aircraft currently in the list
export const getAircraftList = () => aircraftList;

// GET /api/plane - Get all aircraft
export const getAllAircraft = async (req: Request, res: Response) => {
    try {
      const aircraft = await AircraftModel.find();
      res.status(200).json(aircraft);
    } catch (err) {
      console.error('Error fetching aircraft:', err);
      res.status(500).json({ error: 'Failed to fetch aircraft' });
    }
};

// POST /api/addPlane - Add a new aircraft
export const addAircraft = async (req: Request, res: Response) => {
    const { error } = aircraftValidationSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }
  
    try {
      const newAircraft = new AircraftModel(req.body);
      const savedPlane = await newAircraft.save();
      res.status(201).json(savedPlane);
      return;
    } catch (err) {
      console.error('Error inserting aircraft:', err);
      res.status(500).json({ error: 'Failed to insert aircraft' });
      return;
    }
};

// Add or update aircraft via POST from Raspberry Pi data (POST /api/aircraft)
export const addOrUpdateAircraftBulk = (req: Request, res: Response, io: SocketIOServer) => {
    const newData = req.body;
    const currentTime = Date.now();
  
    if (!Array.isArray(newData)) {
      res.status(400).json({ error: 'Invalid data format. Expected an array of aircraft objects.' });
      return;
    }
  
    newData.forEach(entry => {
      const icao = entry.hex?.trim() || entry.flight?.trim(); // Fallback to 'flightId' if 'hex' is missing
      const flight = entry.flight?.trim() || 'N/A';
      const latitude = entry.lat ?? entry.latitude;
      const longitude = entry.lon ?? entry.longitude;
      const altitude = entry.altitude;
      const speed = entry.speed || 0;
      const heading = entry.track ?? entry.heading ?? 0;
  
      // Validate essential fields
      if (!icao || latitude === undefined || longitude === undefined || altitude === undefined) {
        console.warn(`Skipping aircraft due to missing fields: ${JSON.stringify(entry)}`);
        return;
      }
  
      // Update in-memory list
      const existingIndex = aircraftList.findIndex(a => a.icao === icao);
      if (existingIndex !== -1) {
        const existingAircraft = aircraftList[existingIndex];
        aircraftList[existingIndex] = {
          ...existingAircraft,
          flight,
          latitude,
          longitude,
          altitude,
          speed,
          heading,
          lastUpdate: currentTime,
          prevLatitude: existingAircraft.latitude,
          prevLongitude: existingAircraft.longitude,
        };
      } else {
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
      }
    });
  
    // Emit updated list to all WebSocket clients
    io.emit('aircraftData', aircraftList);
  
    res.status(200).json({ message: 'Aircraft data updated successfully' });
    return;
  };

  // Deletes aircraft based off the non-unique icao string in the database
  export const deleteAircraftByIcao = async (req: Request, res: Response) => {
    const { icao } = req.params;  // Assuming icao is passed as a route parameter
    try {
        const deletedAircraft = await AircraftModel.deleteOne({ icao });
        if (deletedAircraft.deletedCount === 0) {
            res.status(404).json({ message: 'Aircraft not found' });
            return;
        }
        res.status(200).json({ message: 'Aircraft deleted successfully' });
        return;
    } catch (err) {
        console.error('Error deleting aircraft:', err);
        res.status(500).json({ error: 'Failed to delete aircraft' });
        return;
    }
};

// Deletes aircraft based off the unique _id in the database
export const deleteAircraftById = async (req: Request, res: Response) => {
    const { id } = req.params;  // Assuming _id is passed as a route parameter
    try {
        const deletedAircraft = await AircraftModel.findByIdAndDelete(id);
        if (!deletedAircraft) {
            res.status(404).json({ message: 'Aircraft not found' });
            return;
        }
        res.status(200).json({ message: 'Aircraft deleted successfully', deletedAircraft });
        return;
    } catch (err) {
        console.error('Error deleting aircraft:', err);
        res.status(500).json({ error: 'Failed to delete aircraft' });
        return;
    }
};

// POST /api/users - Add a new user
export const addUser = async (req: Request, res: Response) => {
    const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      // Return all validation errors
      const errorMessages = error.details.map((detail) => detail.message);
      res.status(400).json({ error: errorMessages });
      return;
    }

    const { username, email, password } = req.body;
  
    // Check if all fields are provided
    if (!username || !password) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return;
    }

    try {
      // Check if the username or email is already taken
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        res.status(400).json({ error: 'Username or email already exists' });
        return;
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,  // Store hashed password
        role: 'user'
      });

      const savedUser = await newUser.save();

      // Respond with success
      res.status(201).json({
        message: 'User created successfully',
        user: { id: savedUser._id, username: savedUser.username, email: savedUser.email, role: savedUser.role }
      });
      return;
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  };

  // POST /api/login - Authenticate user and generate token
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log('1');
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ error: 'Invalid username or password' });
        return;
      }
      console.log('1');
  
      // Compare the provided password with the hashed password in the database
      try {
        // Log the password comparison inputs
        console.log('Password entered:', password);
        console.log('Password in DB (hashed):', user.password);
  
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('Password mismatch');
          res.status(400).json({ error: 'Invalid username or password' });
          return;
        }
  
        console.log('Password matched');
      } catch (error) {
        console.error('Error during password comparison:', error);
        res.status(500).json({ error: 'Internal server error during password comparison' });
        return;
      }
  
      // Generate a JWT (with an expiration time, e.g., 1 hour)
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET ? process.env.JWT_SECRET : '',  // Your JWT secret key
        { expiresIn: '1h' }
      );
    console.log('1');
  
      // Respond with the JWT token
      res.status(200).json({ message: 'Login successful', token });
      return;
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  };