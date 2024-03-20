import React, { useLayoutEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';

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

  // Function to handle logout
  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem('userData');
    localStorage.removeItem('userAccessToken');
    dispatch(resetUserState());
    navigate("/login")
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
    
        {/* User Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{userDetails.username}</h1>
          <p className="mb-2"><span className="font-semibold">Email:</span> {userDetails.email}</p>
          <p className="mb-2"><span className="font-semibold">Mobile:</span> {userDetails.mobile}</p>
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