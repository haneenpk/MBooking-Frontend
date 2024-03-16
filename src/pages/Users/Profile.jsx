import React, { useLayoutEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import ErrorContent from '../../components/Common/ErrorContent';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [userDetails, setUser] = useState(null);
  const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status

  // Sample user data
  const userData = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    mobile: '123-456-7890',
    profilePic: 'https://via.placeholder.com/150', // Sample URL for profile picture
  };

  // Function to handle profile deletion
  const handleDeleteProfile = () => {
    // Add logic for profile deletion here
    alert('Profile deleted!');
  };

  // Function to handle profile update
  const handleFileChange = () => {
    // Add logic for profile update here
    alert('Profile updated!');
  };

  // Function to handle logout
  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem('userData');
    localStorage.removeItem('userAccessToken');
    dispatch(resetUserState());
  };

  useLayoutEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userData');

        if (!userId) {
          navigate('/login');
          return;
        }

        const response = await Axios.get(`/api/user/get/${userId}`);
        setUser(response.data.data);
        setIsBlocked(response.data.data.isBlocked); // Set isBlocked based on user data
      } catch (error) {
        setError(error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (error) {
    console.log(error.response.status);
    if (error.response.data.message === "You are blocked") {
      localStorage.removeItem('userData');
      localStorage.removeItem('userAccessToken');
      dispatch(resetUserState());
      console.log("Your account is blocked");
      navigate("/login")
    }
  }

  // Conditionally render profile component only if user is not blocked
  if (!isBlocked) {
    return (
      <div className="flex justify-center mt-10">
        {/* Profile Picture */}
        <div className="mr-10">
          <div className="mt-4 ml-36">
            <img src={userData.profilePic} alt="Profile" className="rounded-full" />

            {/* Delete Profile Button */}
            <button onClick={handleDeleteProfile} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-1 mt-2">
              Delete Profile
            </button>
          </div>
          <div className="mt-4 ">
            {/* Update Profile Button */}
            <label htmlFor="">Update profile:</label>
            <input
              id="profilePicInput"
              className="border border-gray-300 rounded p-2 ml-2"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {/* User Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{userDetails.username}</h1>
          <p className="mb-2"><span className="font-semibold">Email:</span> {userDetails.email}</p>
          <p className="mb-2"><span className="font-semibold">Mobile:</span> {userDetails.mobile}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2">
            Reset Password
          </button>
          <NavLink to="/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mx-2">
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