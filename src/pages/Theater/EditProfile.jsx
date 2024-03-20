import React, { useState, useLayoutEffect } from 'react';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { editTheaterSchema } from "../../validations/theaterValidations/editTheaterSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { resetTheaterState } from '../../redux/slices/theaterSlice';
import { useDispatch } from 'react-redux';

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State to manage form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: {
            country: '',
            state: '',
            district: '',
            city: ''
        }
    });

    const [error, setError] = useState(null);
    const [isBlocked, setIsBlocked] = useState(true); // New state to track user block status
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name.split(".")[1]]: value
            }
        }));

    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            await editTheaterSchema.validate(formData, { abortEarly: false });
            setErrors({}); // Clear previous validation errors
            const response = await Axios.put(`/api/theater/update/${formData._id}`, formData);
            console.log(response.data.message);
            setServerResponse({ status: "success", message: "Update Successfully" });
            setTimeout(() => {
                setServerResponse({});
                navigate("/theater/profile");
            }, 2000);
        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    useLayoutEffect(() => {
        const fetchTheaterData = async () => {
            try {
                const theaterId = localStorage.getItem('theaterData');
                if (!theaterId) {
                    navigate('/theater/login');
                    return;
                }
                const response = await Axios.get(`/api/theater/get/${theaterId}`);
                setFormData(response.data.data);
                setIsBlocked(response.data.data.isBlocked);
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
            navigate("/theater/login");
        }
    }

    if (!isBlocked) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Theater Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Theater Name' />
                    {errors.name && <FormErrorDisplay error={errors.name} />}
                </div>
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-gray-700 font-semibold mb-2">Mobile</label>
                    <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Mobile' />
                    {errors.mobile && <FormErrorDisplay error={errors.mobile} />}
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block text-gray-700 font-semibold mb-2">Country</label>
                    <input type="text" id="country" name="address.country" value={formData.address.country} onChange={handleAddressChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Country' />
                    {errors.address && errors.address.country && <FormErrorDisplay error={errors.address.country} />}                </div>
                <div className="mb-4">
                    <label htmlFor="state" className="block text-gray-700 font-semibold mb-2">State</label>
                    <input type="text" id="state" name="address.state" value={formData.address.state} onChange={handleAddressChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='State' />
                    {errors.address && errors.address.state && <FormErrorDisplay error={errors.address.state} />}                </div>
                <div className="mb-4">
                    <label htmlFor="district" className="block text-gray-700 font-semibold mb-2">District</label>
                    <input type="text" id="district" name="address.district" value={formData.address.district} onChange={handleAddressChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='District' />
                    {errors.address && errors.address.district && <FormErrorDisplay error={errors.address.district} />}                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">City</label>
                    <input type="text" id="city" name="address.city" value={formData.address.city} onChange={handleAddressChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='City' />
                    {errors.address && errors.address.city && <FormErrorDisplay error={errors.address.city} />}                </div>
                <button onClick={handleSubmit} type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">Save Changes</button>
                {serverResponse && (
                    <div className={`mt-2 p-2 text-center font-bold ${serverResponse.status === "failed" ? "text-red-600 " : "text-green-500"}`} role="alert">
                        {serverResponse.message}
                    </div>
                )}
            </div>
        );
    }
};

export default EditProfile;
