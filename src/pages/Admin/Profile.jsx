import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetAdminState } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { IoLogOutOutline } from "react-icons/io5";
import {
    Button,
} from "@material-tailwind/react";

const UserProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState(null);
    const [adminDetails, setAdminDetails] = useState(null);
    const [isLoading, setLoading] = useState(true); // State to track loading status

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
            setLoading(false)

        } catch (error) {
            setError(error);
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex justify-center mt-32">
            {adminDetails && (
                <div className="w-1/3 bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <span className="text-sm font-semibold text-gray-600 mb-1">Name : </span>
                        <span className="text-lg text-gray-800 mb-4">{adminDetails.name}</span>
                    </div>
                    <div className="mb-7">
                        <span className="text-sm font-semibold text-gray-600 mb-1">Email : </span>
                        <span className="text-lg text-gray-800 mb-4">{adminDetails.email}</span>
                    </div>
                    <NavLink to="/admin/edit-profile" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                        Edit Profile
                    </NavLink>
                    <div className="flex justify-center">
                        <Button onClick={handleLogout} variant="text" className='rounded-full mt-4'>
                            <IoLogOutOutline size={25} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
