// Entry point for the build script in your package.json
import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Nav from './components/Nav';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let ignore = false;

    if (location.pathname === '/') {
      navigate('/buildings');
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default App;
