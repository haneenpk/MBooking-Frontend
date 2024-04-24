import React, { useLayoutEffect } from 'react';
import Axios from "../../api/shared/instance";
import { useLocation } from 'react-router-dom';

function BookingSuccess() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tempTicketId = queryParams.get("tempTicketId");

    useLayoutEffect(() => {
        const fetchTempTicket = async () => {
            try {
                let response = await Axios.get(`/api/user/booking/save/${tempTicketId}`);
                // setTempTicket(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTempTicket();
    }, []);

    return (
        <div className="bg-white mt-16 flex justify-center items-center">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-md mt-24">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">Booking Confirmed!</h1>
                <p className="text-lg mb-6 text-center text-gray-700">Thank you for booking with us.</p>
                <p className="text-lg mb-6 text-center text-gray-700">You're all set. Enjoy the show!</p>
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md block mx-auto w-full max-w-xs">Back to Home</button>
            </div>
        </div>
    );
}

export default BookingSuccess;
