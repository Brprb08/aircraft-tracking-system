import React, { useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <div>
      <h1>Aircraft Tracking System</h1>
    </div>
  );
};

export default App;
