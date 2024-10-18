import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AircraftPage from './components/AircraftPage'; // Import the new AircraftPage component
import SignUp from './components/Signup';
import Login from './components/Login'; // The new Login component

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status from localStorage when the app loads
  useEffect(() => {
    const authStatus = localStorage.getItem('auth') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/aircraft" /> : <Login onLogin={handleLogin}/>} />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route path="/aircraft" element={isAuthenticated ? <AircraftPage onLogout={handleLogout}/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;