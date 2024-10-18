import axios from 'axios';
import { useModal } from '../utils/useModal';

export const fetchAircraft = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/plane');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching aircraft:', error);
    throw error; // Rethrow the error to let the caller handle it
  }
};

export const submitAircraftData = async (aircraftData: {}) => {
  try {
    const response = await axios.post('http://localhost:5000/api/addPlane', aircraftData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting aircraft data:', error);
    throw error; // Rethrow the error to let the caller handle it
  }
};

export const deleteAircraftByICAO = async (icao: string) => {
  try {
    // const response = await axios.delete(`http://localhost:5000/api/aircraft/${icao}`);
    const response = await axios.delete(`http://localhost:5000/api/aircraft/A123BC`);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting aircraft with ICAO: ${icao}`, error);
    throw error; // Rethrow the error
  }
};

export const deleteAircraftByID = async (id: string) => {
  try {
    // const response = await axios.delete(`http://localhost:5000/api/aircraft/id/${id}`);
    const response = await axios.delete('http://localhost:5000/api/aircraft/id/6711dd36650e676c418db07f');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting aircraft with ID: ${id}`, error);
    throw error; // Rethrow the error
  }
};