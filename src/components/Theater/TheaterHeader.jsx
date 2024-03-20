import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const TheaterHeader = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">MBooking</h1>
      <div className="hidden md:flex gap-6 items-center">
        <NavLink to="/theater/dashboard" className="text-white hover:text-gray-300">Dashboard</NavLink>
        <NavLink to="/theater/screens" className="text-white hover:text-gray-300">Screens</NavLink>
        <NavLink to="/theater/theatres" className="text-white hover:text-gray-300">Shows</NavLink>
        <NavLink to="/theater/banner" className="text-white hover:text-gray-300">Banner</NavLink>
        {/* Circle Icon */}
        <NavLink to="/theater/profile" className="w-8 h-8 bg-gray-500 rounded-full"></NavLink>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {showMenu && (
        <div className="md:hidden absolute bg-gray-800 top-full left-0 right-0 py-2 px-4">
          <ul className="flex flex-col gap-2">
            <NavLink to="/theater/dashboard" className="text-white hover:text-gray-300">Screen</NavLink>
            <NavLink to="/theaters" className="text-white hover:text-gray-300">Movies</NavLink>
            <NavLink to="/users" className="text-white hover:text-gray-300">Users</NavLink>
            <NavLink to="/banner" className="text-white hover:text-gray-300">Banner</NavLink>
          </ul>
        </div>
      )}
    </header>
  );
};

export default TheaterHeader;