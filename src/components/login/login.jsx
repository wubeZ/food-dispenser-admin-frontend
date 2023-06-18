import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import logo1 from '../../assets/logo1.png';
import './login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ispending, setIsPending] = useState(false);
  const navigate = useNavigate();


  const handleNavigate = () => {
    navigate('/dashboard');
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMessage('');
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage('');
  };

  const validate = () => {
    var errors = "";
    if (!email || !password) {
        errors = "All fields are required";
    } else if (!/\S+@\S+\.\S+/.test(email) && !/^\d{10}$/.test(email)) {
        errors = "Email or Phone Number is invalid";
    }
    return errors;
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    if (errors) {
        setErrorMessage(errors);
        return;
    }
    setIsPending(true);

    const body = {};
    if (/^\d{10}$/.test(email)) {
        body.phoneNumber = email;
        body.password = password;
    } else {
        body.email = email;
        body.password = password;
    }

    try {
      const response = await axios.post('https://food-dispenser-api.onrender.com/v1/user/login', body);

      if (response.status !== 200) {
        setErrorMessage('An error occurred during login.');
        return;
      }
      const { message, token, user } = response.data;

      // Check if the user is an admin
      if (!user.isAdmin) {
        setErrorMessage('You are not authorized to log in as an admin.');
        return;
      }

      // Save the token to local storage
      localStorage.setItem('token', token);
      setIsPending(false);

      onLogin();

      handleNavigate();

    } catch (error) {
      // Handle the login error
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred during login.');
      }
      setIsPending(false);
    }

  };

  return (
    <div className="container">
      <div className="login-content">
        <div className="login-picture">
          <img src={logo1} alt="My Image" />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          {errorMessage && <p className='errorMessage'>Error : {errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email / Phone Number </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className='password-form'>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                />
                  <span className="toggle-password-icon" onClick={togglePasswordVisibility} > 
                      {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </span>
            </div>
            {!ispending && <button type="submit">Log In</button>}
            {ispending && <button disabled>Logging In...</button>}
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
