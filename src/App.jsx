import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import UserDashboard from './components/UserDashboard/userDashboard';



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      // Check if the authentication token exists in local storage
      const token = await localforage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
    <Route path="/" element= {!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard"/> } />
      <Route path="/login" element= {!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard"/> } />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/user" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
};


const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
