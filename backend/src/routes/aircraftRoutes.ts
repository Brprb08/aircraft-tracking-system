import express from 'express';
import { getAllAircraft, addAircraft, addOrUpdateAircraftBulk, deleteAircraftByIcao, deleteAircraftById, addUser, loginUser } from '../service/aircraftService';
import { piRateLimiter } from '../middlewares/rateLimit';
import { authenticatePi, verifyToken } from '../middlewares/auth'
import { Server as SocketIOServer } from 'socket.io';

const router = express.Router();


export default function (io: SocketIOServer) {
    router.get('/plane', verifyToken, piRateLimiter, getAllAircraft);
    router.post('/addPlane', piRateLimiter, addAircraft);
    router.post('/aircraft', piRateLimiter, authenticatePi, (req, res) => addOrUpdateAircraftBulk(req, res, io));
    router.delete('/aircraft/:icao', piRateLimiter, deleteAircraftByIcao);
    router.delete('/aircraft/id/:id', piRateLimiter, deleteAircraftById);
    router.post('/users', addUser);
    router.post('/login', loginUser);
    return router;
}