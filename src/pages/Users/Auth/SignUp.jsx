import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../../../validations/userValidations/signUpSchema";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        district: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Trim whitespace from form data
        const trimmedFormData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value.trim()])
        );

        try {
            // Validate formData against the signup schema
            await signupSchema.validate(trimmedFormData, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            // If validation passes, proceed with signup
            const response = await axios.post(`${import.meta.env.VITE_AXIOS_BASE_URL}/api/user/register`, formData);
            console.log(response.data.message);

            navigate(`/verify-otp?purpose=signup&email=${formData.email}`);

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
                </div>
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input name={"username"} onChange={handleChange} type={"text"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Username" />
                        {errors.username && <FormErrorDisplay error={errors.username} />}
                    </div>
                    <div>
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email</label>
                        <input name={"email"} onChange={handleChange} type={"email"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Email" />
                        {errors.email && <FormErrorDisplay error={errors.email} />}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input name={"mobile"} onChange={handleChange} type={"tel"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Phone" />
                        {errors.mobile && <FormErrorDisplay error={errors.mobile} />}
                    </div>
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/2">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <input name={"country"} onChange={handleChange} type={"text"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Country" />
                            {errors.country && <FormErrorDisplay error={errors.country} />}
                        </div>
                        <div className="w-full md:w-1/2">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <input name={"state"} onChange={handleChange} type={"text"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="State" />
                            {errors.state && <FormErrorDisplay error={errors.state} />}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                        <input name={"district"} onChange={handleChange} type={"text"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="District" />
                        {errors.district && <FormErrorDisplay error={errors.district} />}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input name={"password"} onChange={handleChange} type={"password"} autoComplete="current-password" className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Password" />
                        {errors.password && <FormErrorDisplay error={errors.password} />}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input name={"confirmPassword"} onChange={handleChange} type={"password"} autoComplete="current-password" className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Confirm Password" />
                        {errors.confirmPassword && <FormErrorDisplay error={errors.confirmPassword} />}
                    </div>
                    {serverResponse && (
                        <div className="p-3 text-center font-bold text-red-600" role="alert">
                            {serverResponse.message}
                        </div>
                    )}
                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">Sign up</button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    <p className="mt-2">Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-400">Log in here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
