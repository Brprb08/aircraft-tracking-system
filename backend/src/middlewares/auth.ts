import { Request, Response } from 'express';

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