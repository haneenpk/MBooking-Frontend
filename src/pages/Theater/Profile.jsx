import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetTheaterState } from '../../redux/slices/theaterSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [theaterDetails, setTheater] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false); // Default to false
  const [loading, setLoading] = useState(true); // State to manage loading spinner

  const userData = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    mobile: '123-456-7890',
    profilePic: 'https://via.placeholder.com/150', // Sample URL for profile picture
  };

  const handleLogout = () => {
    localStorage.removeItem('theaterData');
    localStorage.removeItem('theaterAccessToken');
    dispatch(resetTheaterState());
    navigate('/theater/login');
  };

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        const theaterId = localStorage.getItem('theaterData');
        if (!theaterId) {
          navigate("/theater/login");
          return;
        }

        const response = await Axios.get(`/api/theater/get/${theaterId}`);
        setTheater(response.data.data);
        setIsBlocked(response.data.data.isBlocked);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error);
      }
    };

    fetchTheaterData();
  }, [navigate]);

  useEffect(() => {
    if (isBlocked) {
      navigate("/theater/login");
    }
  }, [isBlocked, navigate]);

  if (error) {
    if (error.response && error.response.data.message === "You are blocked") {
      localStorage.removeItem('theaterData');
      localStorage.removeItem('theaterAccessToken');
      dispatch(resetTheaterState());
      console.log("Your account is blocked");
      navigate("/theater/login")
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!theaterDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center mt-28">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2">
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">Name : </label>
          <span className="text-gray-700">{theaterDetails.name}</span>
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">Email : </label>
          <span className="text-gray-700">{theaterDetails.email}</span>
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">Mobile : </label>
          <span className="text-gray-700">{theaterDetails.mobile}</span>
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2">Screen Count : </label>
          <span className="text-gray-700">{theaterDetails.screenCount}</span>
        </div>
        <div className="mb-7">
          <label className="text-gray-700 font-bold mb-2">Address :-</label>
          <p className="text-gray-700">{theaterDetails.address.country}, {theaterDetails.address.state}, {theaterDetails.address.district}, {theaterDetails.address.city}</p>
        </div>
        <NavLink to="/theater/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Edit Profile Details
          </NavLink>
        <div className="flex justify-center items-center mt-8">
          <button onClick={handleLogout} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-md">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
