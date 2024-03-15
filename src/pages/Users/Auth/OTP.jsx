import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import OtpInput from "react-otp-input";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import { otpSchema } from "../../../validations/userValidations/otpSchema";
// import { setLoggedIn } from "../../../redux/slices/userSlice";
// import { verifyOtp, resendOtp } from "../../../api/shared/auth";

const OTP = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const purpose = queryParams.get("purpose");
    const email = queryParams.get("email");

    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [showSentButton, setShowSentButton] = useState(true);
    const [serverResponse, setServerResponse] = useState("");
    const [errors, setErrors] = useState("");

    const handleVerification = async (e) => {
        console.log('hhh');
        e.preventDefault();
        setServerResponse("");

        try {
            // Validate OTP and email against the schema
            await otpSchema.validate({ otp });

            console.log(otp, email);

            // If validation passes, proceed with OTP verification
            const response = await axios.post(`http://localhost:3000/api/user/validateOtp`, { otp, email });
            // await verifyOtp({ otp, email });

            if (response) {
                setServerResponse(response);

                if (response.status === 200) {
                    localStorage.removeItem("otpTimer");
                    if (purpose === "forgot-password") {
                        navigate("/reset-password");
                    } else if (purpose === "signup") {
                        // dispatch(setLoggedIn(true));
                        navigate("/login");
                    }
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

        const response = await axios.post(`http://localhost:3000/api/user/resendOtp`, { email });

        setServerResponse("");
        // await resendOtp({ email });
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
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">OTP Verification</h2>
                    <div className="rounded-md shadow-sm mt-3">
                        <div className="mb-3">
                            <input value={otp} onChange={handleChange} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Enter the otp" />
                            {errors &&
                                <FormErrorDisplay error={errors} />
                            }
                        </div>
                    </div>
                    <div className={`mt-3 ${serverResponse.status === "failed" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} border border-solid border-gray-300 px-4 py-3 rounded`} role="alert">
                        {serverResponse.message}
                    </div>
                    {showSentButton && (
                        <div>
                            <button onClick={handleVerification} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                                Sent OTP
                            </button>
                        </div>
                    )}
                </div>
                <div className="text-center font-bold text-lg">
                    {timer > 0 ? (
                        <p>Resend OTP in {timer} seconds</p>
                    ) : (
                        <button onClick={handleResend} className="text-blue-600 hover:text-blue-400 focus:outline-none">
                            Resend OTP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTP;