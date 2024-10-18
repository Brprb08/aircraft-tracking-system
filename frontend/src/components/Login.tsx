import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

interface LoginProps {
  onLogin: () => void; // Prop for handling login
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  interface ErrorResponse {
    error: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Store the JWT token in localStorage for persistent authentication
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Mark the user as authenticated
        onLogin();

        // Redirect to aircraft page
        navigate('/aircraft');
      }
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(axiosError.response.data.error);
          if(axiosError.response.data.error === 'Invalid username or password') {
            setError(axiosError.response.data.error);
          } else { 
            setError('Fix this missing error');
          }
        } else if (axiosError.request) {
          // The request was made but no response was received
          setError('No response received from the server. Please try again later.');
          console.error('Request data:', axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an error
          setError('Error occurred while setting up the request');
          console.error('Error message:', axiosError.message);
        }
      } else {
        // Handle other errors not related to Axios
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Log In</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <div className="signup-link">
          <p>Don't have an account?</p>
          <Link to="/signup" className="signup-button">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;