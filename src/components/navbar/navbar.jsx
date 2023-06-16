import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li> <NavLink to="/dashboard" activeClassName="active">Create Device</NavLink> <br/><br></br> </li>
        <li> <NavLink to="/user" activeClassName="active">User Analysis</NavLink> <br/><br></br> </li>
        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;