import { Request, Response } from 'express';
import { AircraftModel } from '../dao/aircraftDAO';
import { aircraftValidationSchema } from '../validation/aircraftValidation';
import { Aircraft } from '../interfaces/aircraft';
import { Server as SocketIOServer } from 'socket.io';

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