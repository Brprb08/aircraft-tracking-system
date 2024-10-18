import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import '../css/Login.css';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  interface ErrorResponse {
    error: string;
  }

  const token = localStorage.getItem('token');  // Fetch the token from localStorage

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // Add the token to the Authorization header
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make POST request to the backend to create the user
      const response = await axios.post('http://localhost:5000/api/users', {
        username,
        email,
        password
      }, {headers});

      if (response.status === 201) {
        setSuccess('Account created successfully!');
        // Optionally, redirect to login page after successful signup
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response && axiosError.response.data) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if(axiosError.response.data.error === 'Username or email already exists') {
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
        <h2 className="login-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Create Account</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        {/* Add a link to go back to login */}
        <div className="signup-link">
          <p>Already have an account?</p>
          <button className="signup-button" onClick={() => navigate('/')}>Go to Login</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;