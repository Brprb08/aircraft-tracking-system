import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// API Key Authentication Middleware
export const authenticatePi = (req: Request, res: Response, next: Function) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.PI_API_KEY; 
    console.log(req.headers['x-api-key']);
  
    if (apiKey === validApiKey) {
      next(); // Proceed to the next middleware
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
  };


// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers['authorization']?.split(' ')[1];  // 'Bearer <token>'
  
    if (!token) {
      res.status(403).json({ error: 'No token provided' });
      return;
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : '') as JwtPayload | string;
      
      console.log(req);
      // Attach the decoded payload (e.g., userId, username) to the req object
      (req as Request & { user?: JwtPayload | string }).user = decoded;  // req.user now has the decoded token data
      
      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  };