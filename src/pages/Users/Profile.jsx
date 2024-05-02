import React, { useEffect, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from "../../redux/slices/userSlice";
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
    localStorage.removeItem('userData');
    localStorage.removeItem('userAccessToken');
    dispatch(resetUserState());
    toast.success('Logout successful')
    navigate("/login")
  };

  useEffect(() => {
    if (error && error.response.data.message === "You are blocked") {
      localStorage.removeItem('userData');
      localStorage.removeItem('userAccessToken');
      dispatch(resetUserState());
      navigate("/login");
    }
  }, [error, navigate]);

  // Function to handle profile picture change
  const handleProfilePicChange = async (event) => {
    try {
      const userId = localStorage.getItem('userData');
      const formData = new FormData();
      formData.append('profilePicture', event.target.files[0]);
      const response = await Axios.patch(`/api/user/update/profileimage/${userId}`, formData);
      fetchUserData();
      dispatch(setUserData(response.data.data));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  // Function to delete profile picture
  const deleteProfilePic = async () => {
    try {
      const userId = localStorage.getItem('userData');
      const response = await Axios.patch(`/api/user/remove/profileimage/${userId}`);
      fetchUserData();
      dispatch(setUserData(response.data.data));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userData');
      if (!userId) {
        navigate('/login');
        return;
      }
      const response = await Axios.get(`/api/user/get/${userId}`);
      const userData = response.data.data;
      setUserDetails(userData);
      setIsBlocked(userData.isBlocked);
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
      <div className="flex justify-center items-center mt-24">
        <div className="max-w-xl mx-auto px-11 rounded-md shadow-md bg-white py-20">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="md:mr-8 flex flex-col items-center">
              <img src={userDetails?.profilePic ? `${import.meta.env.VITE_AXIOS_BASE_URL}/${userDetails.profilePic}` : 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" id="profilePicInput" />
                <label htmlFor="profilePicInput" className="hover:bg-blue-600 bg-blue-500 text-white mb-2 border rounded-md p-2 cursor-pointer">Update Profile</label>
              </div>
              <button onClick={deleteProfilePic} className="mt-3 text-sm text-red-600 hover:text-red-700 hover:underline">
                Delete Profile
              </button>
            </div>
            <div className="mt-6 md:mt-0 border-l-2 pl-6 border-gray-600">
              <h1 className="text-3xl font-bold mb-4">{userDetails.username}</h1>
              <p className="mb-2"><span className="font-semibold">Email:</span> {userDetails.email}</p>
              <p className="mb-2"><span className="font-semibold">Mobile:</span> {userDetails.mobile}</p>
              <div className='mt-7'>
                <NavLink to="/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2">
                  Edit Profile
                </NavLink>
                <NavLink to="/booking-history" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 ">
                  Bookings
                </NavLink>
              </div>
              <div className='mt-6'>
              <NavLink to="/wallet" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mr-2 ">
                Wallet
              </NavLink>
              </div>

            </div>
          </div>
          <div className='justify-center text-center'>

            <button onClick={handleLogout} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mt-10 shadow-md">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // Render null if user is blocked, to prevent rendering the profile component
    return null;
  }
};

export default UserProfile;
