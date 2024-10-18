import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export interface Aircraft {
  icao: string;
  flight: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  lastUpdate: number;
  prevLatitude?: number;
  prevLongitude?: number;
}

export const useSocket = () => {
  const [aircraftData, setAircraftData] = useState<Aircraft[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('aircraftData', (data: Aircraft[]) => {
      console.log('Received aircraft data via WebSocket:', data);
      setAircraftData(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return aircraftData;
};