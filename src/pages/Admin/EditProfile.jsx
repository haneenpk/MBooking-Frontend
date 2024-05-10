import React, { useState, useLayoutEffect } from 'react';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { editSchema } from "../../validations/adminValidations/editSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const EditProfile = () => {

    const navigate = useNavigate();

    // State to manage form fields
    const [formData, setFormData] = useState({
        name: ''
    });

    const [error, setError] = useState(null);

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const [isLoading, setLoading] = useState(true); // State to track loading status

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add logic to submit form data
        console.log(formData);
        try {
            // Validate formData against the signup schema
            await editSchema.validate(formData, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            // If validation passes, proceed with signup
            const response = await Axios.put(`/api/admin/update/${formData._id}`, formData);
            console.log(response.data.message);
            setServerResponse({ status: "success", message: "Update Successfully" })
            setTimeout(() => {
                setServerResponse({})
                navigate("/admin/profile")
            }, 2000)

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    useLayoutEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminId = localStorage.getItem('adminData');

                if (!adminId) {
                    navigate('/admin/login');
                    return;
                }

                const response = await Axios.get(`/api/admin/get/${adminId}`);
                setFormData(response.data.data);
                setLoading(false)
            } catch (error) {
                setError(error);
                setLoading(false)
            }
        };

        fetchAdminData();
    }, [navigate]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Name' />
                {errors.name &&
                    <FormErrorDisplay error={errors.name} />
                }
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder='Email' disabled />
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
