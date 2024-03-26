import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status

  // Function to handle logout
  const handleLogout = () => {
    // localStorage.clear();
    localStorage.removeItem('userData');
    localStorage.removeItem('userAccessToken');
    dispatch(resetUserState());
    navigate("/login")
  };



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

  // Function to handle profile picture change
  const handleProfilePicChange = async (event) => {

    try {
      const userId = localStorage.getItem('userData');

      const formData = new FormData();
      formData.append('profilePicture', event.target.files[0]);

      const response = await Axios.patch(`/api/user/update/profileimage/${userId}`, formData);

      fetchUserData()

      console.log(response);


    } catch (error) {
      console.error("Error updating profile picture:", error);
    }

  };


  // Function to delete profile picture
  const deleteProfilePic = async () => {
    try {
      const userId = localStorage.getItem('userData');

      const response = await Axios.patch(`/api/user/remove/profileimage/${userId}`);

      fetchUserData()

      console.log(response);

    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userData');

      console.log(`${import.meta.env.VITE_AXIOS_BASE_URL}`);

      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await Axios.get(`/api/user/get/${userId}`);
      setUserDetails(response.data.data);
      setIsBlocked(response.data.data.isBlocked); // Set isBlocked based on user data

    } catch (error) {
      setError(error);
    }
  };

  useLayoutEffect(() => {

    fetchUserData();

  }, [navigate]);

  // Conditionally render profile component only if user is not blocked
  if (!isBlocked) {
    return (
      <div className="flex justify-center mt-10">
        <div className="flex flex-col items-center">
          <img src={userDetails.profilePic ? `${import.meta.env.VITE_AXIOS_BASE_URL}/${userDetails.profilePic}` : 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
          <div className="relative">
            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" id="profilePicInput" />
            <label htmlFor="profilePicInput" className="mb-2 border border-gray-300 rounded-md p-2 cursor-pointer">Update Profile</label>
          </div>
          <button onClick={deleteProfilePic} className="mt-3 text-sm text-red-600 hover:text-red-700 hover:underline">
            Delete Profile
          </button>
        </div>

        {/* User Details */}
        <div className="ml-6">
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
