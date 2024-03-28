import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetAdminState } from '../../redux/slices/adminSlice';

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState(null);
    const [adminDetails, setAdminDetails] = useState(null);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminAccessToken');
        dispatch(resetAdminState());
        navigate("/admin/login");
    };

    const fetchAdminData = async () => {
        try {
            const adminId = localStorage.getItem('adminData');

            if (!adminId) {
                navigate('/admin/login');
                return;
            }

            const response = await Axios.get(`/api/admin/get/${adminId}`);
            const adminData = response.data.data;
            setAdminDetails(adminData);

        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []); // Call only once when component mounts

    return (
        <div className="flex justify-center mt-10">
            {/* User Details */}
            {adminDetails && (
                <div className="ml-6">
                    <h1 className="text-3xl font-bold mb-4">{adminDetails.name}</h1>
                    <p className="mb-2"><span className="font-semibold">Email:</span> {adminDetails.email}</p>
                    <NavLink to="/admin/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mx-2">
                        Edit Profile Details
                    </NavLink>
                    <button onClick={handleLogout} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
