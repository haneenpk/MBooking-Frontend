import { useState } from "react";
import { toast } from 'sonner'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import { loginSchema } from "../../../validations/userValidations/loginSchema";
import { setLoading } from "../../../redux/slices/commonSlice";
import { setLoggedIn, setAdminData } from "../../../redux/slices/adminSlice";
import { setLoggedIn as setUserLoggedIn, setUserData } from "../../../redux/slices/userSlice";
import { setLoggedIn as setTheaterLoggedIn, setTheaterData } from "../../../redux/slices/theaterSlice";

const Login = ({ role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});

            console.log("back:",import.meta.env.VITE_AXIOS_BASE_URL);

            const response = await axios.post(`${import.meta.env.VITE_AXIOS_BASE_URL}/api/${role}/login`, formData);

            console.log("response: ", response);

            if (response && response.status === 200) {
                localStorage.setItem(`${role}AccessToken`, response?.data?.accessToken);
                localStorage.setItem(`${role}Data`, response?.data?.data?._id);

                // Dispatch actions to update state
                dispatch(setLoading(true));
                if (role === "admin") {
                    dispatch(setLoggedIn(true));
                    dispatch(setAdminData(response?.data?.data?.username));
                } else if (role === "user") {
                    dispatch(setUserLoggedIn(true));
                    dispatch(setUserData(response?.data?.data?.username));
                } else {
                    dispatch(setTheaterLoggedIn(true));
                    dispatch(setTheaterData(response?.data?.data?.username));
                }
                dispatch(setLoading(false));

                toast.success('Login successful');

                // Navigate after state updates
                if (role === "admin") {
                    navigate("/admin");
                } else if (role === "user") {
                    navigate("/home");
                } else {
                    navigate("/theater");
                }
            } else {
                // Handle server response errors
                setServerResponse(response);
            }
        } catch (error) {
            // Handle form validation errors
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to {role} account</h2>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input name={"email"} onChange={handleChange} type={"text"} className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Email" />
                        {errors.email && <FormErrorDisplay error={errors.email} />}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" onChange={handleChange} type={showPassword ? "text" : "password"} autoComplete="current-password" className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Password" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 focus:outline-none mt-5">
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 01.198-3.31M9.88 9.88a3 3 0 014.24 4.24M15 12a3 3 0 01-6 0c0-.795.31-1.513.815-2.059m4.169 4.169L4.22 4.22m15.56 15.56L4.22 4.22"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <FormErrorDisplay error={errors.password} />}
                    </div>
                    {serverResponse && (
                        <div className={`p-3 text-center font-bold ${serverResponse.status === "failed" ? "text-red-600 " : "text-green-500"}`}>
                            {serverResponse.message}
                        </div>
                    )}
                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">Sign in</button>
                    </div>
                </form>
                {role !== "admin" && (
                    <div className="text-center text-sm text-gray-600">
                        {role === "user" && (
                            <p className="mt-2">Don't have an account? <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-400">Sign up for a new account</Link></p>
                        )}
                        {role === "theater" && (
                            <p className="mt-2">Don't have an account? <Link to="/theater/register" className="font-medium text-blue-600 hover:text-blue-400">Register for a theatre account</Link></p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
