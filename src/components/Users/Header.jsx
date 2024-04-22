import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

const Header = () => {
  const userData = useSelector(state => state.user.userData);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-gray-800 py-4 px-6 flex justify-between items-center fixed top-0 w-full z-10">
      <h1 className="text-white text-2xl font-bold">MBooking</h1>
      <div className="hidden md:flex gap-6 items-center">
        <NavLink to="/home" className="text-white hover:text-gray-300">Home</NavLink>
        <NavLink to="/theaters" className="text-white hover:text-gray-300">Shows</NavLink>
        <NavLink to="/chat" className="text-white hover:text-gray-300">Chat</NavLink>
        {/* Circle Icon */}
        <NavLink to="/profile" className="w-8 h-8 bg-gray-500 rounded-full">
        {userData && userData.profilePic && (
          <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${userData.profilePic}`} alt="Profile" className="w-8 h-8 rounded-full" />
        )}
        </NavLink>
      </div>

      {showMenu && (
        <div className="md:hidden absolute bg-gray-800 top-full left-0 right-0 py-2 px-4">
          <ul className="flex flex-col gap-2">
            <NavLink to="/dashboard" className="text-white hover:text-gray-300">Dashboard</NavLink>
            <NavLink to="/theaters" className="text-white hover:text-gray-300">Theaters</NavLink>
            <NavLink to="/users" className="text-white hover:text-gray-300">Users</NavLink>
            <NavLink to="/banner" className="text-white hover:text-gray-300">Banner</NavLink>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
