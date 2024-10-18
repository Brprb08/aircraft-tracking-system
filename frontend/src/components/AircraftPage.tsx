import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';
import { fetchAircraft, submitAircraftData, deleteAircraftByICAO, deleteAircraftByID, addUser } from '../service/apiService';
import { useModal } from '../utils/useModal';
import { useSocket } from '../utils/useSocket';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
    onLogout: () => void; // Prop for handling login
  }

const AircraftPage: React.FC<LogoutProps> = ({onLogout}) => {
  const aircraftData = useSocket();
  const {
    contactModalVisible,
    instructionModalVisible,
    errorModalVisible,
    errorMessage,
    openContactModal,
    closeContactModal,
    openInstructionModal,
    closeInstructionModal,
    closeErrorModal,
    openErrorModal
  } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (instructionModalVisible || contactModalVisible) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }
  }, [contactModalVisible, instructionModalVisible]);


const exampleAircraftData = {
  icao: 'A123BC',
  flight: 'UA123',
  altitude: '32a000',
  speed: '5a00',
  timestamp: Date.now(),
  country: 'USA',
  airline: 'Boeing 747'
};

const exampleAircraftData1 = {
  icao: 'A123BC',
  flight: 'UA123',
  altitude: 32000,
  speed: 500,
  timestamp: Date.now(),
  country: 'USA',
  airline: 'Boeing 747'
};

// Possible later on
// additionalData: {
//     model: 'Boeing 737', 
//     country: 'United States',
//     airline: 'United Airlines',
//     engineType: 'Jet',  
//     wingSpan: 35.8       
//   }

// Function to rotate plane icon based off heading
const createRotatedIcon = (iconUrl: string, angle: number) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<img src="${iconUrl}" style="transform: rotate(${angle}deg); width: 25px; height: 25px;" />`,
    iconSize: [25, 25],
  });
};

// Function to handle fetching aircraft data
const handleFetchAircraft = async () => {
  try {
    const data = await fetchAircraft();
    console.log('Fetched aircraft data:', data);
  } catch (error) {
    openErrorModal('Failed to fetch aircraft data');
  }
};

// Function to handle submitting aircraft data
const handleSubmitAircraft = async () => {
  const aircraftData = {
    icao: 'A123BC',
    flight: 'UA123',
    altitude: 32000,
    speed: 500,
    timestamp: Date.now(),
    country: 'USA',
    airline: 'Boeing 747',
  };

  try {
    const data = await submitAircraftData(aircraftData);
    console.log('Submitted aircraft data:', data);
  } catch (error) {
    openErrorModal('Failed to submit aircraft data');
  }
};

// Function to delete aircraft by ICAO
const handleDeleteAircraftByICAO = async () => {
  try {
    const data = await deleteAircraftByICAO('A123BC');
    console.log('Deleted aircraft:', data);
  } catch (error) {
    openErrorModal('Failed to delete aircraft by ICAO');
  }
};

// Function to delete aircraft by ID
const handleDeleteAircraftByID = async () => {
  try {
    const data = await deleteAircraftByID('6711dd36650e676c418db07f');
    console.log('Deleted aircraft:', data);
  } catch (error) {
    openErrorModal('Failed to delete aircraft by ID');
  }
};

// Function to add Users
const handleAddUser = async () => {
    const user = {
        username: 'brprb',
        email: 'peltobrendan@yahoo.com',
        password: 'password',
      };
    try {
      const data = await addUser(user);
      console.log('Added user:', data);
    } catch (error) {
      openErrorModal('Failed to add user');
    }
  };

  const handleLogout = async () => {
    // Clear the localStorage to remove the JWT token
    localStorage.removeItem('authToken');

    onLogout();
    // Redirect to the login page
    navigate('/');
  };


  // Define a default center position for the map
  const defaultCenter: [number, number] = [44.8756, -91.4383]; // Example coordinates

  return (
    <div>
      <div className='container'>
        <div className="header">
          <button id="contact" onClick={openContactModal}>Contact</button>
          {contactModalVisible && (
            <div className="modal-stuff" onClick={closeContactModal}>
              <div className="modal-content-contact" onClick={(e) => e.stopPropagation()}>
                <div className='contact-header'>
                  <span className="close-contact" onClick={closeContactModal}>&times;</span>
                  <h2 className="name">Brendan Pelto</h2>
                </div>
                <p>Phone: (651) 829 - 5695</p>
                <p><a href="https://www.linkedin.com/in/brendan-pelto-52a885221/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                <p><a href="https://github.com/Brprb08" target="_blank" rel="noopener noreferrer">GitHub</a></p>
              </div>
            </div>
          )}

          <h1 className="title">Aircraft Tracking System</h1>

          <button id="info" onClick={openInstructionModal}>Information</button>
          <button id="logout" onClick={handleLogout} className="logout-button">Logout</button>
          {instructionModalVisible && (
            <div className="modal-stuff" onClick={closeInstructionModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={closeInstructionModal}>&times;</span>
                <button id="getRequest" onClick={(e: any) => handleFetchAircraft()}>Get</button>
                <button id="postRequest" onClick={(e: any) => handleSubmitAircraft()}>Post</button>
                <button id="deleteICAORequest" onClick={(e: any) => handleDeleteAircraftByICAO()}>DeleteICAO</button>
                <button id="deleteIDRequest" onClick={(e: any) => handleDeleteAircraftByID()}>DeleteID</button>
                <button id="addUserRequest" onClick={(e: any) => handleAddUser()}>AddUser</button>
                <section id="overview">
                <h1>Welcome to My Aircraft Tracking Project</h1>
                <p>
                  Using an ADS-B antenna, I track planes within a 30-mile radius of my home in real-time.
                  Click on any plane on the map to view more details, such as flight ID, altitude, speed,
                  and heading. This project is built with a Raspberry Pi and updates plane positions every 10 seconds.
                </p>
              </section>

              <section id="how-it-works">
                <h2>How It Works</h2>
                <p><strong>ADS-B Technology</strong>: I use an ADS-B antenna to capture signals broadcast by nearby planes.</p>
                <p><strong>Coverage Area</strong>: Planes are tracked within a 30-mile radius of my home.</p>
                <p><strong>Raspberry Pi Integration</strong>: The Raspberry Pi processes the incoming data and plots it on the map.</p>
              </section>

              <section id="goals">
                <h2>Project Goals</h2>
                <ul>
                  <li>Learn to use Raspberry Pi effectively</li>
                  <li>Explore aviation technology through ADS-B</li>
                  <li>Build a real-time tracking system</li>
                </ul>
              </section>

              <section id="map">
                <h2>Interactive Map</h2>
                <p>Click on the planes to view detailed flight information.</p>
              </section>

              <section id="future-improvements">
                <h2>Future Improvements</h2>
                <ul>
                  <li>Increase range with a more powerful antenna</li>
                  <li>Add flight origin/destination data</li>
                  <li>Improve real-time data visualization on the map</li>
                </ul>
              </section>

              <section id="get-involved">
                <h2>Get Involved</h2>
                <p>If you're curious about ADS-B or want to collaborate, reach out to me!</p>
              </section>

              <section id="credits">
                <h2>Credits</h2>
                <ul>
                  <li>Raspberry Pi</li>
                  <li>ADS-B Antenna</li>
                  <li>OpenStreetMap</li>
                  <li>FlightRadar24 (Inspiration)</li>
                </ul>
              </section>
              </div>
            </div>
          )}
        </div>

        <div className='map-section'>
          <MapContainer center={defaultCenter} zoom={5} className='map'>
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {aircraftData.map((aircraft) => (
              aircraft.icao ? (
                <Marker
                  key={aircraft.icao} // Ensure 'icao' is unique
                  position={[aircraft.latitude, aircraft.longitude]}
                  icon={createRotatedIcon('/img/aircraft.png', aircraft.heading)}
                >
                  <Popup>
                    Flight: {aircraft.flight} <br /> Altitude: {aircraft.altitude} ft <br /> Speed: {aircraft.speed} knots
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
        {errorModalVisible && (
          <div className="modal-stuff" onClick={closeErrorModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeErrorModal}>&times;</span>
              <h2>Error</h2>
              <p>{errorMessage}</p> {/* Display the error message here */}
            </div>
          </div>
        )}

        <div className="footer">
          <p>Aircraft Tracking System &copy; 2024 | Powered by ADS-B Technology | Built with Raspberry Pi</p>
        </div>
      </div>
    </div>
  );
};

export default AircraftPage;