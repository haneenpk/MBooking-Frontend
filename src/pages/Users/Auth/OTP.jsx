import { useState, useEffect } from "react";
import { toast } from 'sonner'
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import FormErrorDisplay from "../../../components/Common/FormErrorDisplay";
import { otpSchema } from "../../../validations/userValidations/otpSchema";
import {
    Button,
    Input,
} from "@material-tailwind/react";

const OTP = () => {
    const navigate = useNavigate();

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
        e.preventDefault();
        setServerResponse("");

        try {
            await otpSchema.validate({ otp });

            setErrors("")

            const response = await axios.post(`${import.meta.env.VITE_AXIOS_BASE_URL}/api/user/validateOtp`, { otp, email });

            if (response) {
                setServerResponse(response);

                if (response.status === 200) {
                    localStorage.removeItem("otpTimer");
                    if (purpose === "forgot-password") {
                        navigate("/reset-password");
                    } else if (purpose === "signup") {
                        toast.success('Register successfully. Please login')
                        navigate("/login");
                    }
                }
            }
        } catch (error) {
            if (error.name === "ValidationError") {
                setErrors(error.errors[0]);
            } else {
                console.error("Error during verifying otp:", error);
                setServerResponse({ status: "failed", message: error.response?.data?.message });
            }
        }
    };

    const handleResend = async () => {
        const response = await axios.post(`${import.meta.env.VITE_AXIOS_BASE_URL}/api/user/resendOtp`, { email });

        setServerResponse("");
        if (response) {
            setServerResponse(response);
            if (response.status === 200) {
                setTimer(60);
                setIsTimerActive(true);
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
                        setIsTimerActive(false);
                        clearInterval(intervalId);
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isTimerActive]);

    useEffect(() => {
        if (timer === 0) {
            setShowSentButton(false);
        }
    }, [timer]);

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={{ backgroundImage: "url('/public/movieTicketImg-transformed.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">OTP Verification</h2>
                    <div className="mt-3">
                        <Input value={otp} onChange={handleChange} type={"text"} label="Enter the OTP" color="white" />
                        {errors && (
                            <div className="mt-2 w-fit bg-red-100 p-1 px-2 h-8 rounded-full">
                                <FormErrorDisplay error={errors} />
                            </div>
                        )}
                    </div>
                    {serverResponse.status === "failed" && (
                        <div className="flex justify-center items-center mt-2">
                            <div className={`text-center font-bold p-1 px-2 h-8 rounded-full w-fit ${serverResponse.status === "failed" ? "text-red-600 bg-red-100 " : "text-green-600 bg-green-100"}`}>
                                {serverResponse.message}
                            </div>
                        </div>
                    )}

                    {showSentButton && (
                        <div className="mt-3">
                            <Button onClick={handleVerification} size="lg" fullWidth color="yellow">Send OTP</Button>
                        </div>
                    )}
                </div>
                <div className="text-center font-bold text-lg">
                    {timer > 0 ? (
                        <p className="text-white">Resend OTP in {timer} seconds</p>
                    ) : (
                        <Button onClick={handleResend} color="blue">Resend OTP</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTP;
