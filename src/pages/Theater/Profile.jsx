import React, { useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetTheaterState } from '../../redux/slices/theaterSlice';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [theaterDetails, setTheater] = useState(null);
  const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status

  // Sample user data
  const userData = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    mobile: '123-456-7890',
    profilePic: 'https://via.placeholder.com/150', // Sample URL for profile picture
  };

  // Function to handle logout
  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem('theaterData');
    localStorage.removeItem('theaterAccessToken');
    dispatch(resetTheaterState());
    // navigate("/theater/login")
  };

  useLayoutEffect(() => {
    const theaterId = localStorage.getItem('theaterData');

    const fetchTheaterData = async () => {
      try {
        if (!theaterId) {
          navigate("/theater/login");
          return;
        }

        const response = await Axios.get(`/api/theater/get/${theaterId}`);
        console.log(response);
        setIsBlocked(response.data.data.isBlocked);
        setTheater(response.data.data)

      } catch (error) {
        setError(error);
      }
    };

    fetchTheaterData();

  }, [navigate]);

  if (error) {
    if (error.response && error.response.data.message === "You are blocked") {
      localStorage.removeItem('theaterData');
      localStorage.removeItem('theaterAccessToken');
      dispatch(resetTheaterState());
      console.log("Your account is blocked");
      navigate("/theater/login")
    }
  }

  if (!isBlocked) {
    return (
      <div className="flex justify-center mt-10">

        {/* User Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{theaterDetails.name}</h1>
          <p className="mb-2"><span className="font-semibold">Email:</span> {theaterDetails.email}</p>
          <p className="mb-2"><span className="font-semibold">Mobile:</span> {theaterDetails.mobile}</p>
          <p className="mb-2"><span className="font-semibold">Screen Count:</span> {theaterDetails.screenCount}</p>
          <p className="mb-2"><span className="font-semibold underline">Address:-</span></p>
          <div className='ml-3'>
            <p className="mb-2"><span className="font-semibold">Country:</span> {theaterDetails.address.country}</p>
            <p className="mb-2"><span className="font-semibold">State:</span> {theaterDetails.address.state}</p>
            <p className="mb-2"><span className="font-semibold">Distrit:</span> {theaterDetails.address.district}</p>
            <p className="mb-2"><span className="font-semibold">City:</span> {theaterDetails.address.city}</p>
          </div>
          <NavLink to="/theater/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mx-2">
            Edit Profile Details
          </NavLink>
          <button onClick={handleLogout} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    );
  } else {
    // Render null if user is blocked, to prevent rendering the profile component
    return null;
  }
};

export default UserProfile;