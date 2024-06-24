import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import { Avatar } from "@material-tailwind/react";
import { VscAccount } from "react-icons/vsc";

const Header = () => {
  const userData = useSelector(state => state.user.userData);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-gray-900 py-4 px-6 flex justify-between items-center sticky top-0 w-full z-50 shadow-md h-20">
      <h1 className="text-white text-2xl font-bold">MBooking</h1>
      <div className="hidden md:flex gap-6 items-center">
        <NavLink
          to="/home"
          className="text-white hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white"
          activeClassName="border-b-2 border-white"
        >
          Home
        </NavLink>
        <NavLink
          to="/show"
          className="text-white hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white"
          activeClassName="border-b-2 border-white"
        >
          Shows
        </NavLink>
        <NavLink
          to="/chat"
          className="text-white hover:text-gray-300 transition duration-300 border-b-2 border-transparent hover:border-white"
          activeClassName="border-b-2 border-white"
        >
          Chat
        </NavLink>
        {/* Circle Icon */}
        <NavLink to="/profile" className={'w-12'}>
          {userData && userData.profilePic ? (
            <Avatar
              src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${userData.profilePic}`}
              alt="avatar"
              withBorder={true}
              className="p-0.5"
              color='white'
              size='md'
            />
          ) : (
            <VscAccount color='white' size={41} />
          )}
        </NavLink>
      </div>

      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={showMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {showMenu && (
        <div className="md:hidden absolute bg-gray-800 top-full left-0 right-0 py-2 px-4">
          <ul className="flex flex-col gap-2">
            <NavLink
              to="/home"
              className="text-white hover:text-gray-300"
              activeClassName="underline text-white"
              onClick={() => setShowMenu(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/show"
              className="text-white hover:text-gray-300"
              activeClassName="underline text-white"
              onClick={() => setShowMenu(false)}
            >
              Shows
            </NavLink>
            <NavLink
              to="/chat"
              className="text-white hover:text-gray-300"
              activeClassName="underline text-white"
              onClick={() => setShowMenu(false)}
            >
              Chat
            </NavLink>
            <NavLink
              to="/profile"
              className="text-white hover:text-gray-300"
              activeClassName="underline text-white"
              onClick={() => setShowMenu(false)}
            >
              Profile
            </NavLink>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
