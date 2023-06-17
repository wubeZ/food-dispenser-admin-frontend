import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/', { replace: true });
  }, [navigate]);

  const logout = () => {
      localStorage.removeItem('token');
  };

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
