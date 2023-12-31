import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/login/login.jsx';
import Dashboard from './components/dashboard/dashboard.jsx';
import UserDashboard from './components/UserDashboards/userDashboard.jsx';
import Feedback from './components/feedback/Feedback.jsx';
import './App.css';



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');

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
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/user" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />} />
      <Route path="/feedback" element={isAuthenticated ? <Feedback /> : <Navigate to="/" />} />
    </Routes>
  );
};


const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
