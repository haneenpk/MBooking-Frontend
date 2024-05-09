import { useState, useEffect } from "react";
import { toast } from 'sonner'
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import { otpSchema } from "../../../validations/userValidations/otpSchema";

const OTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [showSentButton, setShowSentButton] = useState(true);
    const [serverResponse, setServerResponse] = useState("");
    const [errors, setErrors] = useState("");

    const handleVerification = async (e) => {
        e.preventDefault();
        setServerResponse("");

        try {
            // Validate OTP and email against the schema
            await otpSchema.validate({ otp });

            const response = await axios.post(`http://localhost:3000/api/theater/validateOTP`, { otp, email });

            if (response) {
                setServerResponse(response);

                if (response.status === 200) {
                    localStorage.removeItem("otpTimer");
                    toast.success('Register successfully. Please login')
                    navigate("/theater/login");
                }
            }
        } catch (error) {
            // Handle the validation error or set an appropriate server response
            if (error.name === "ValidationError") {
                setErrors(error.errors[0]);
            } else {
                console.error("Error during verifying otp:", error);
                setServerResponse({ status: "failed", message: error.response?.data?.message });
            }
        }
    };

    const handleResend = async () => {
        const response = await axios.post(`http://localhost:3000/api/theater/resendOTP`, { email });

        setServerResponse("");
        if (response) {
            setServerResponse(response);
            if (response.status === 200) {
                setTimer(60); // Reset the timer
                setIsTimerActive(true); // Start the timer again
                setShowSentButton(true);
            }
        }
    };

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    useEffect(() => {
        let intervalId;

        if (isTimerActive) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer === 1) {
                        setIsTimerActive(false); // Stop the timer when it reaches 0
                        clearInterval(intervalId);
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [isTimerActive]);

    useEffect(() => {
        if (timer === 0) {
            setShowSentButton(false); // Hide the "Sent OTP" button after timeout
        }
    }, [timer]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">OTP Verification</h2>
                    <div className="mt-3">
                        <input value={otp} onChange={handleChange} type="text" className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400" placeholder="Enter the OTP" />
                        {errors && <FormErrorDisplay error={errors} />}
                    </div>
                    {serverResponse.status === "failed" && (
                        <div className="mt-3 bg-red-100 text-red-700 border border-solid border-gray-300 px-4 py-3 rounded" role="alert">
                            {serverResponse.message}
                        </div>
                    )}

                    {showSentButton && (
                        <div className="mt-3">
                            <button onClick={handleVerification} className="w-full py-3 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800">Sent OTP</button>
                        </div>
                    )}
                </div>
                <div className="text-center font-bold text-lg">
                    {timer > 0 ? (
                        <p>Resend OTP in {timer} seconds</p>
                    ) : (
                        <button onClick={handleResend} className="text-blue-600 hover:text-blue-400 focus:outline-none">Resend OTP</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTP;
