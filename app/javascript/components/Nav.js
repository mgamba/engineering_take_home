import React from 'react';
import { NavLink } from 'react-router-dom';
import ClientSelector from "./ClientSelector";

const Nav = () => {
  return (
    <div className="nav">
      <div className="nav-links">
        <NavLink to={"buildings"}>Home</NavLink>
        <NavLink to={"buildings/new"}>New</NavLink>
      </div>
      <ClientSelector />
    </div>
  );
}

export default Nav
