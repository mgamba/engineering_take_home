// Entry point for the build script in your package.json
import React from 'react';
import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import BuildingList from './components/BuildingList';

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
      <div>
        <NavLink to={"buildings"}>Home</NavLink>
        <NavLink to={"buildings/new"}>New</NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default App;
