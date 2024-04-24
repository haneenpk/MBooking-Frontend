import React, { useLayoutEffect, useState, useEffect } from 'react';
import Axios from "../../api/shared/instance";
import { resolvePath, useLocation } from 'react-router-dom';

function ShowCheckout() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tempTicketId = queryParams.get("tempTicketId");

    const [tempTicket, setTempTicket] = useState({});
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatTime = (time) => {
        if (!time) return ''; // Check if time is undefined
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    const handleProceedPay = async () => {
        try {
            const response = await Axios.post(`/api/user/booking/ticket/${tempTicketId}`);
            console.log(response.data.session);
            const session = response.data.session;
    
            if (session && session.url) {
                window.location.href = session.url; // Redirect the user to the Stripe checkout URL
            } else {
                console.error('Invalid session data');
            }
        } catch (error) {
            console.error('Error proceeding to pay:', error);
        }
    }    

    useLayoutEffect(() => {
        const fetchTempTicket = async () => {
            try {
                let response = await Axios.get(`/api/user/show/tempTicket/${tempTicketId}`);
                setTempTicket(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTempTicket();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center mt-16">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="mb-3">
                    <p className="text-red-500 text-center">
                        Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                    </p>
                </div>
                <div className="mb-3">
                    <h2 className="text-2xl font-bold mb-2 text-center">Checkout</h2>
                </div>

                {/* Booking Details */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
                    <div className="flex items-center mb-2">
                        <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${tempTicket.movieId?.image}`} alt="Movie Poster" className="w-24 h-auto mr-4" />
                        <div>
                            <p className="font-semibold">{tempTicket.movieId?.moviename}</p>
                            <p className="text-gray-600"><span className="font-semibold text-black">{tempTicket.theaterId?.name}:</span> {`(${tempTicket.theaterId?.address.district},${tempTicket.theaterId?.address.country})`}</p>
                            <p className="text-gray-600"><span className="font-semibold text-black">Date:</span> {formatDate(tempTicket.showId?.date)}</p>
                            <p className="text-gray-600"><span className="font-semibold text-black">Starting Time:</span> {formatTime(tempTicket.showId?.startTime)}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-600"><span className="font-semibold text-black">Tickets:</span> {tempTicket.seatCount}</p>
                    </div>
                </div>

                {/* Amount Details */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Amount Details</h3>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Diamond Seats ({tempTicket.diamondSeats?.seatCount} x {tempTicket.diamondSeats?.singlePrice})</p>
                        <p className="text-gray-600">₹{tempTicket.diamondSeats?.totalPrice}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Gold Seats ({tempTicket.goldSeats?.seatCount} x {tempTicket.goldSeats?.singlePrice})</p>
                        <p className="text-gray-600">₹{tempTicket.goldSeats?.totalPrice}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-gray-600">Silver Seats ({tempTicket.silverSeats?.seatCount} x {tempTicket.silverSeats?.singlePrice})</p>
                        <p className="text-gray-600">₹{tempTicket.silverSeats?.totalPrice}</p>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                        <p className="font-semibold">Total</p>
                        <p className="font-semibold">₹{tempTicket.totalPrice}</p>
                    </div>
                </div>

                {/* Proceed to Pay Button */}
                <button onClick={handleProceedPay} className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                    Proceed to Pay
                </button>
            </div>
        </div>
    );
}

export default ShowCheckout;