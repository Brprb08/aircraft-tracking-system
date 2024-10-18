import Joi from 'joi';

export const aircraftValidationSchema = Joi.object({
  icao: Joi.string().required().messages({
    'string.empty': 'ICAO code is required',
    'any.required': 'ICAO code is mandatory'
  }),
  flight: Joi.string().optional(),
  altitude: Joi.number().required().messages({
    'number.base': 'Altitude must be a number',
    'any.required': 'Altitude is required'
  }),
  speed: Joi.number().optional(),
  timestamp: Joi.date().optional(),
  country: Joi.string().optional(),
  airline: Joi.string().optional(),
});

// Validation schema for query parameters (if needed)
export const getAircraftQuerySchema = Joi.object({
    icao: Joi.string().optional(), // Optional filters
    flight: Joi.string().optional()
});