import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout logic
    logout();

    // Redirect to the login page
    navigate('/login', { replace: true });
  }, [navigate]);

  const logout = () => {
    // Clear any stored user data or tokens
    // For example, you can remove the token from local storage
    localStorage.removeItem('token');
  };

  return (
    <div>
      <h2>Logging out...</h2>
      {/* You can also show a loader or additional messages if needed */}
    </div>
  );
};

export default Logout;
