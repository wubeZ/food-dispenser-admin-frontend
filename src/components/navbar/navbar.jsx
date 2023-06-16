import React from 'react';
import { Link, NavLink, Routes, Route } from 'react-router-dom';
import './navbar.css';
import Dashboard from '../dashboard/dashboard';
import UserDashboard from '../UserDashboard/userDashboard';
import localforage from 'localforage';

const handleLogout = async () => {
  await localforage.removeItem('token');
  window.location.href = '/login';
};


const Navbar = () => {
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




// const Navbar = ({ name, totalDevices = "", totalUsers = "", currentDeviceCount = ""}) => {
//   return (
//     <div className="navbar">
//       <h2> {name} </h2>
//       <div className="navbar-values">
//         <p>Total Devices: {totalDevices}</p>
//         <p>Total Users: {totalUsers}</p>
//         <p>Offline Device: {currentDeviceCount}</p>
//       </div>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

export default Navbar;
