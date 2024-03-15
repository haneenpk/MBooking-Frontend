import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupSchema } from "../../../validations/userValidations/signUpSchema";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";

const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        mobile: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            // Validate formData against the signup schema
            await signupSchema.validate(formData, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            // If validation passes, proceed with signup
            const response =await axios.post(`http://localhost:3000/api/user/register`, formData);
            console.log(response.data.message);

            navigate(`/verify-otp?purpose=signup&email=${formData.email}`);

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
                </div>
                <div className="rounded-md shadow-sm ">
                    <div className="mb-3">
                        <label htmlFor="username">Username</label>
                        <input name={"username"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Username" />
                        {errors.username &&
                            <FormErrorDisplay error={errors.username} />
                        }
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email-address">Email</label>
                        <input name={"email"} onChange={handleChange} type={"email"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Email" />
                        {errors.email &&
                            <FormErrorDisplay error={errors.email} />
                        }
                    </div>

                    <div className="mb-3">
                        <label htmlFor="phone">Phone</label>
                        <input name={"mobile"} onChange={handleChange} type={"tel"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Phone" />
                        {errors.phone &&
                            <FormErrorDisplay error={errors.phone} />
                        }
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input name={"password"} onChange={handleChange} type={"password"} autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Password" />
                        {errors.password &&
                            <FormErrorDisplay error={errors.password} />
                        }
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input name={"confirmPassword"} onChange={handleChange} type={"password"} autoComplete="current-password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Confirm Password" />
                        {errors.confirmPassword &&
                            <FormErrorDisplay error={errors.confirmPassword} />
                        }
                    </div>

                </div>

                {serverResponse && (
                    <div
                        className={`mt-2 p-2 text-center font-bold text-red-600`}
                        role="alert"
                    >
                        {serverResponse.message}
                    </div>
                )}

                <div>
                    <button onClick={handleSignUp} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign up
                    </button>
                </div>

                <div>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-400">
                            I have already account
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SignUp;




