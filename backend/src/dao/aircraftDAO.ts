import mongoose from 'mongoose';

const aircraftSchema = new mongoose.Schema({
  icao: {
    type: String,
    required: true,
  },
  flight: {
    type: String,
  },
  model: {
    type: String,
  },
  altitude: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
  },
  airline: {
    type: String,
  },
}, { collection: 'plane-data' });

export const AircraftModel = mongoose.model('AircraftModel', aircraftSchema);