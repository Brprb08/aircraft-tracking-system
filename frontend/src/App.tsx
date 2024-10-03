import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import Leaflet for custom marker icons

// Define the structure of the aircraft data
interface Aircraft {
  flightId: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
}

const App: React.FC = () => {
  const [aircraftData, setAircraftData] = useState<Aircraft[]>([]);

  // Initial state for the fake planes
  const [fakePlanes, setFakePlanes] = useState<Aircraft[]>([
    { flightId: 'plane1', latitude: 44.8756, longitude: -91.4383, altitude: 10000, speed: 120 },
    { flightId: 'plane2', latitude: 44.8766, longitude: -91.4393, altitude: 10500, speed: 150 },
    { flightId: 'plane3', latitude: 44.8746, longitude: -91.4373, altitude: 11000, speed: 180 }
  ]);

  // Function to simulate circular movement for each plane
  const movePlanesInCircles = () => {
    setFakePlanes((prevPlanes) => 
      prevPlanes.map((plane, index) => {
        const angle = (Date.now() / 1000 + index * 2) % (2 * Math.PI); // Unique angle for each plane
        const radius = 0.01; // Radius of the circle
        const newLatitude = plane.latitude + radius * Math.cos(angle);
        const newLongitude = plane.longitude + radius * Math.sin(angle);
        return {
          ...plane,
          latitude: newLatitude,
          longitude: newLongitude,
        };
      })
    );
  };

  // Fetch aircraft data from the backend
  useEffect(() => {
    const fetchAircraftData = () => {
      // Fetch real aircraft data
      axios.get('http://localhost:5000/api/aircraft')
        .then(response => {
          if (response.data.length > 0) {
            setAircraftData((prevAircraftData) => [...prevAircraftData, ...response.data]); // Keep adding new data
          }
        })
        .catch(error => {
          console.error('Error fetching aircraft data:', error);
        });

      // Move the fake planes in circles
      movePlanesInCircles();
    };

    // Initially set the fake planes
    setAircraftData([...fakePlanes]);

    // Periodically fetch data and move fake planes every 5 seconds
    const intervalId = setInterval(fetchAircraftData, 2000);

    return () => clearInterval(intervalId);  // Cleanup interval on component unmount
  }, [fakePlanes]);

  // Define a default center position for the map
  const defaultCenter: [number, number] = [44.8756, -91.4383]; // Example coordinates

  return (
    <div>
      <h1>Aircraft Tracking System</h1>
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100vh' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        
        {/* Render real aircraft data */}
        {aircraftData.map(aircraft => (
          <Marker 
            key={aircraft.flightId} 
            position={[aircraft.latitude, aircraft.longitude]} 
            icon={L.icon({ iconUrl: '/img/light-aircraft.png', iconSize: [25, 25] })}
          >
            <Popup>
              Flight: {aircraft.flightId} <br /> Altitude: {aircraft.altitude} ft <br /> Speed: {aircraft.speed} knots
            </Popup>
          </Marker>
        ))}

        {/* Render the fake planes */}
        {fakePlanes.map(plane => (
          <Marker 
            key={plane.flightId} 
            position={[plane.latitude, plane.longitude]} 
            icon={L.icon({ iconUrl: '/img/light-aircraft.png', iconSize: [25, 25] })}
          >
            <Popup>
              Flight: {plane.flightId} <br /> Altitude: {plane.altitude} ft <br /> Speed: {plane.speed} knots
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;