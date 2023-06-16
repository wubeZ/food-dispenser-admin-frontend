import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';
import localforage from 'localforage';


const Navbar = () => {

  const handleLogout = async () => {
    await localforage.removeItem('token');
  };

  return (
    <nav>
      <ul>
        <li> <NavLink to="/dashboard" activeclassname="active">Create Device</NavLink> <br/><br></br> </li>
        <li> <NavLink to="/user" activeclassname="active">User Analysis</NavLink> <br/><br></br> </li>
        <li><a href="/login" onClick={handleLogout}>Logout </a> </li>
      </ul>
    </nav>
  );
}


export default Navbar;
