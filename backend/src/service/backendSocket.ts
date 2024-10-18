import { Socket } from 'socket.io';
import { getAircraftList } from './aircraftService';

// Handle WebSocket connections
export const handleAircraftSocketConnection = (socket: Socket) => {
  console.log('Client connected via WebSocket');

  // Send current aircraft data upon connection
  socket.emit('aircraftData', getAircraftList());

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
  });
};