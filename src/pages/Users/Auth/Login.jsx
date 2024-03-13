import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import { loginSchema } from "../../../validations/userValidations/loginSchema";
import initializeUser from "../../../utils/initializeUser";
import { login } from "../../../api/shared/auth";

const Login = ({ role }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role
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

            const response = await login(formData);

            if (response) {
                setServerResponse(response);
                if (response.status === 200) {
                    if (role === "admin") {
                        initializeUser("admin", dispatch);
                        navigate("/admin");
                    } else {
                        initializeUser("user", dispatch);
                        navigate("/");
                    }
                }
            }
        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log in to your account</h2>
                </div>
                <div className="rounded-md shadow-sm">
                    <div className="mb-3">
                        <label htmlFor="username">Username</label>
                        <input name={"username"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Username" />
                        {errors.username &&
                            <FormErrorDisplay error={errors.username} />
                        }
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input name={"password"} onChange={handleChange} type={"password"} autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Password" />
                        {errors.password &&
                            <FormErrorDisplay error={errors.password} />
                        }
                    </div>

                </div>

                {role === "user" &&
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/verify-email" className="font-medium text-blue-600 hover:text-blue-400">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                }

                {serverResponse && (
                    <div
                        className={`mt-2 p-2 text-center font-bold ${serverResponse.status === "failed" ? "text-red-600 " : "text-green-500"}`}
                        role="alert"
                    >
                        {serverResponse.message}
                    </div>
                )}

                <div>
                    <button onClick={handleLogin} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign in
                    </button>
                </div>
                {role === "user" &&
                    (
                        <div>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                <Link to="/sign-up" className="font-medium text-blue-600 hover:text-blue-400">
                                    sign up for a new account
                                </Link>
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Login;