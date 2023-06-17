import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <nav>
      <ul>
        <li> <NavLink to="/dashboard" activeClassName="active">Create Device</NavLink> </li>
        <li> <NavLink to="/user" activeClassName="active">User Analysis</NavLink> </li>
        <li> <NavLink to= "/feedback" activeClassName="active"> Feedback</NavLink> </li>
        <li> <NavLink to="/" onClick={handleLogout}> Logout</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;