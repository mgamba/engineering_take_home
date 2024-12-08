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
      navigate('/buildingList');
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <div>
        <NavLink to={"buildingList"}>Home</NavLink>
        <NavLink to={"newBuilding"}>New</NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default App;
