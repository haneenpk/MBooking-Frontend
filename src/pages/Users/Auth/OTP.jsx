import React, { useState, useEffect } from "react";

const OTP = () => {
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(true);

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

    const handleResend = () => {
        setTimer(60); // Reset the timer
        setIsTimerActive(true); // Start the timer again
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">OTP Verification</h2>
                    <div className="rounded-md shadow-sm mt-3">
                        <div className="mb-3">
                            <input name={"username"} type={"text"} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Enter the otp" />
                        </div>
                    </div>
                    <div>
                        <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Sent OTP
                        </button>
                    </div>
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