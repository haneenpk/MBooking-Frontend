import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../../../validations/userValidations/signUpSchema";
import handleInputChange from "../../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import {
    Button,
    Input,
    Typography
} from "@material-tailwind/react";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        handleInputChange(e, formData, setFormData, setServerResponse, setErrors);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: "url('/public/movieTicketImg-transformed.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="w-1/2 space-y-8 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign up</h2>
                </div>
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                Username
                            </Typography>
                            <Input name={"username"} onChange={handleChange} type={"text"} label="Username" color="white" />
                            {errors.username && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.username} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                Email
                            </Typography>
                            <Input name={"email"} onChange={handleChange} type={"text"} label="Email" color="white" />
                            {errors.email && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.email} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                Phone
                            </Typography>
                            <Input name={"mobile"} onChange={handleChange} type={"text"} label="Phone" color="white" />
                            {errors.mobile && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.mobile} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                Country
                            </Typography>
                            <Input name={"country"} onChange={handleChange} type={"text"} label="Country" color="white" />
                            {errors.country && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.country} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                State
                            </Typography>
                            <Input name={"state"} onChange={handleChange} type={"text"} label="State" color="white" />
                            {errors.state && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.state} />
                                </div>
                            )}
                        </div>
                        <div>
                            <Typography className='mb-1' variant="h6" color="white">
                                District
                            </Typography>
                            <Input name={"district"} onChange={handleChange} type={"text"} label="District" color="white" />
                            {errors.district && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.district} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Typography className='mb-1' variant="h6" color="white">
                                Password
                            </Typography>
                            <input name="password" onChange={handleChange} type={showPassword ? "text" : "password"} autoComplete="current-password" className="text-white h-10 mt-1 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-transparent" placeholder="Password" />
                            <div className="absolute top-11 right-0 pr-3 flex items-center">
                                <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 focus:outline-none">
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
                            {errors.password && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.password} />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Typography className='mb-1' variant="h6" color="white">
                                Confirm Password
                            </Typography>
                            <input name="confirmPassword" onChange={handleChange} type={showConfirmPassword ? "text" : "password"} autoComplete="current-password" className="text-white h-10 mt-1 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-transparent" placeholder="Confirm Password" />
                            <div className="absolute top-11 right-0 pr-3 flex items-center">
                                <button type="button" onClick={toggleConfirmPasswordVisibility} className="text-gray-500 focus:outline-none">
                                    {showConfirmPassword ? (
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
                            {errors.confirmPassword && (
                                <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                    <FormErrorDisplay error={errors.confirmPassword} />
                                </div>
                            )}
                        </div>
                    </div>
                    {serverResponse && (
                        <div className="flex justify-center items-center">
                            <div className={`text-center font-bold p-1 px-2 h-8 rounded-full w-fit ${serverResponse.status === "failed" ? "text-red-600 bg-red-100 " : "text-green-600 bg-green-100"}`}>
                                {serverResponse.message}
                            </div>
                        </div>
                    )}
                    <div>
                        <Button type="submit" size="lg" fullWidth color="yellow">Sign up</Button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-600">
                    <p className="mt-2 text-white">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-white hover:bg-gray-900 bg-gray-800 p-1 rounded-md transition duration-200 ease-in-out hover:underline"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
