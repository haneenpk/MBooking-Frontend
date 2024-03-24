import React, { useState, useEffect } from 'react';
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
  const [isBlocked, setIsBlocked] = useState(false); // Default to false

  // Sample user data
  const userData = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    mobile: '123-456-7890',
    profilePic: 'https://via.placeholder.com/150', // Sample URL for profile picture
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('theaterData');
    localStorage.removeItem('theaterAccessToken');
    dispatch(resetTheaterState());
  };

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        const theaterId = localStorage.getItem('theaterData');
        if (!theaterId) {
          // No theater ID found, navigate to login
          navigate("/theater/login");
          return;
        }

        const response = await Axios.get(`/api/theater/get/${theaterId}`);
        setTheater(response.data.data);
        setIsBlocked(response.data.data.isBlocked);
      } catch (error) {
        // Handle network errors
        setError(error);
      }
    };

    fetchTheaterData();
  }, [navigate]);

  useEffect(() => {
    // Check if the user is blocked and navigate to login if blocked
    if (isBlocked) {
      navigate("/theater/login");
    }
  }, [isBlocked, navigate]);

  if (error) {
    // Handle network errors
    console.error("Error fetching theater data:", error);
    
    return <div>Error fetching theater data</div>;
  }

  if (!theaterDetails) {
    // Render loading state until theater details are fetched
    return <div>Loading...</div>;
  }

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
          <p className="mb-2"><span className="font-semibold">District:</span> {theaterDetails.address.district}</p>
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
};

export default UserProfile;
