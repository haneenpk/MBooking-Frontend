import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { registerTheaterSchema } from "../../../validations/theaterValidations/registerTheaterSchema";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        country: "",
        state: "",
        district: "",
        city: ""
    });

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const handleRegistre = async (e) => {
        e.preventDefault();

        try {
            // Validate formData against the signup schema
            await registerTheaterSchema.validate(formData, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            // If validation passes, proceed with signup
            const response = await axios.post(`http://localhost:3000/api/theater/register`, formData);
            console.log(response.data.message);

            navigate(`/theatre/verify-otp?email=${formData.email}`);

        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
                </div>
                <div className="rounded-md shadow-sm ">
                    <div className="mb-3">
                        <label htmlFor="name">Name</label>
                        <input name={"name"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Name of Theater" />
                        {errors.name &&
                            <FormErrorDisplay error={errors.name} />
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
                        <label htmlFor="mobile">Mobile</label>
                        <input name={"mobile"} onChange={handleChange} type={"tel"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Phone" />
                        {errors.mobile &&
                            <FormErrorDisplay error={errors.mobile} />
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

                    <div className="mb-3 flex flex-wrap justify-between">
                        <div className="w-full md:w-48">
                            <label htmlFor="country">Country</label>
                            <input name={"country"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Country" />
                            {errors.country &&
                                <FormErrorDisplay error={errors.country} />
                            }
                        </div>

                        <div className="w-full md:w-48">
                            <label htmlFor="state">State</label>
                            <input name={"state"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="State" />
                            {errors.state &&
                                <FormErrorDisplay error={errors.state} />
                            }
                        </div>

                        <div className="w-full md:w-48">
                            <label htmlFor="district">District</label>
                            <input name={"district"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="District" />
                            {errors.district &&
                                <FormErrorDisplay error={errors.district} />
                            }
                        </div>

                        <div className="w-full md:w-48">
                            <label htmlFor="city">City</label>
                            <input name={"city"} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="City" />
                            {errors.city &&
                                <FormErrorDisplay error={errors.city} />
                            }
                        </div>
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
                    <button onClick={handleRegistre} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        Sign up
                    </button>
                </div>

                <div>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <Link to="/theater/login" className="font-medium text-blue-600 hover:text-blue-400">
                            I have already registered
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
