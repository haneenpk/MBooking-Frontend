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

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});

            const response = await axios.post(`http://localhost:3000/api/${role}/login`, formData);

            console.log("response:", response);

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
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input name={"password"} onChange={handleChange} type={"password"} autoComplete="current-password" className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Password" />
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
