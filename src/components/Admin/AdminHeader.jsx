import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Avatar,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

const AdminHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [about, setAbout] = useState(false);
  const aboutRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleAbout = () => {
    setAbout(!about);
  };

  const handleClickOutside = (event) => {
    if (aboutRef.current && !aboutRef.current.contains(event.target)) {
      setAbout(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 py-4 px-6 flex justify-between items-center sticky top-0 w-full z-10 shadow-md">
      <h1 className="text-white text-2xl font-bold">MBooking</h1>
      <div className="hidden md:flex gap-6 items-center">
        <NavLink to="/admin/" className="text-white hover:text-gray-300">Dashboard</NavLink>
        <NavLink to="/admin/users" className="text-white hover:text-gray-300">Users</NavLink>
        <NavLink to="/admin/theaters" className="text-white hover:text-gray-300">Theaters</NavLink>
        <NavLink to="/admin/upcoming" className="text-white hover:text-gray-300">Upcoming</NavLink>
        <NavLink to="/admin/movie" className="text-white hover:text-gray-300">Movie</NavLink>
        {/* Circle Icon */}
        <NavLink to="/admin/profile">
          <VscAccount color='white' size={32} />
        </NavLink>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <Popover placement="bottom-end">
        <div className="relative">
          <div onClick={toggleAbout}>
            <VscAccount color='white' size={32} />
          </div>
          {about && (
            <div className='fixed top-14 right-6 z-20' ref={aboutRef}>
              <div className="w-72 fixed top-18 bg-white p-3 rounded-lg shadow-lg right-6 z-20">
                <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
                  <VscAccount size={40} />
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Tania Andrew
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-medium text-blue-gray-500"
                    >
                      Admin
                    </Typography>
                  </div>
                </div>
                <div>
                  <div className='flex ml-2'>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.00299 5.884L9.99999 9.882L17.997 5.884C17.9674 5.37444 17.7441 4.89549 17.3728 4.54523C17.0015 4.19497 16.5104 3.99991 16 4H3.99999C3.48958 3.99991 2.99844 4.19497 2.62717 4.54523C2.2559 4.89549 2.03259 5.37444 2.00299 5.884Z"
                        fill="#90A4AE"
                      />
                      <path
                        d="M18 8.11798L10 12.118L2 8.11798V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H16C16.5304 16 17.0391 15.7893 17.4142 15.4142C17.7893 15.0391 18 14.5304 18 14V8.11798Z"
                        fill="#90A4AE"
                      />
                    </svg>
                    <Typography variant="small" color="gray" className="font-medium text-blue-gray-500 ml-2">
                      person@example.com
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Popover>

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

export default AdminHeader;
