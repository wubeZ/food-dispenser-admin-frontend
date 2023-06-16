import React from 'react';
import { Link, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import './navbar.css';
import localforage from 'localforage';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await localforage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <nav>
      <ul>
        <li> <NavLink to="/dashboard" activeclassname="active">Create Device</NavLink> <br/><br></br> </li>
        <li> <NavLink to="/user" activeclassname="active">User Analysis</NavLink> <br/><br></br> </li>
        <li><a onClick={handleLogout}>Logout </a> </li>
      </ul>
    </nav>
  );
}


export default Navbar;
