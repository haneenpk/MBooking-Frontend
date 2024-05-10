import React, { useState, useLayoutEffect } from 'react';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { editSchema } from "../../validations/userValidations/editSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { resetUserState } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State to manage form fields
    const [formData, setFormData] = useState({
        username: '',
        mobile: ''
    });

    const [error, setError] = useState(null);
    const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");
    const [isLoading, setLoading] = useState(true); // State to track loading status

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
        );
        try {
            // Validate formData against the edit schema
            await editSchema.validate(trimmedFormData, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            // If validation passes, proceed with update
            const response = await Axios.put(`/api/user/update/${formData._id}`, trimmedFormData);
            console.log(response.data.message);
            setServerResponse({ status: "success", message: "Update Successfully" })
            setTimeout(() => {
                setServerResponse({})
                navigate("/profile")
            }, 2000)

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
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
                setFormData(response.data.data);
                setIsBlocked(response.data.data.isBlocked); // Set isBlocked based on user data
                setLoading(false)
            } catch (error) {
                setError(error);
                setLoading(false)
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

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-md mx-auto mt-36 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Username' />
                {errors.username &&
                    <FormErrorDisplay error={errors.username} />
                }
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Email' disabled />
            </div>

            <div className="mb-4">
                <label htmlFor="mobile" className="block text-gray-700 font-semibold mb-2">Mobile</label>
                <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Mobile' />
                {errors.mobile &&
                    <FormErrorDisplay error={errors.mobile} />
                }
            </div>

            <button onClick={handleSubmit} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Save Changes</button>

            {serverResponse && (
                <div
                    className={`mt-2 p-2 text-center font-bold ${serverResponse.status === "failed" ? "text-red-600 " : "text-green-500"}`}
                    role="alert"
                >
                    {serverResponse.message}
                </div>
            )}

        </div>
    );
};

export default EditProfile;
