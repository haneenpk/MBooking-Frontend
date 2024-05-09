import React, { useLayoutEffect, useState, useEffect } from 'react';
import { toast } from 'sonner';
import Axios from "../../api/shared/instance";
import { useLocation, useNavigate } from 'react-router-dom';

function ShowCheckout() {

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tempTicketId = queryParams.get("tempTicketId");

    const [tempTicket, setTempTicket] = useState({});
    const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
    const [paymentOption, setPaymentOption] = useState('Stripe'); // Default: 'stripe'
    const [userDetails, setUserDetails] = useState(null);

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
            if (paymentOption === 'Stripe') {
                const response = await Axios.post(`/api/user/booking/ticket/${tempTicketId}?payment=${paymentOption}`);
                console.log(response.data.session);
                const session = response.data.session;

                if (session && session.url) {
                    window.location.href = session.url; // Redirect the user to the Stripe checkout URL
                } else {
                    console.error('Invalid session data');
                }
            } else if (paymentOption === 'Wallet') {
                if (tempTicket.totalPrice <= userDetails.wallet) {
                    const response = await Axios.post(`/api/user/booking/ticket/${tempTicketId}?payment=${paymentOption}`);
                    // Implement wallet payment logic here
                    console.log(response);
                    if (response.data.user) {
                        console.log('Processing wallet payment...');
                        navigate(`/booking/success?tempTicketId=${tempTicketId}`)
                    }
                } else {
                    toast.error('Insufficient balance')
                }

            } else {
                console.error('No payment option selected');
            }
        } catch (error) {
            console.error('Error proceeding to pay:', error);
        }
    };


    useLayoutEffect(() => {
        const fetchTempTicket = async () => {
            try {
                let response = await Axios.get(`/api/user/show/tempTicket/${tempTicketId}`);
                setTempTicket(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userData');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const response = await Axios.get(`/api/user/get/${userId}`);
                const userData = response.data.data;
                setUserDetails(userData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTempTicket();
        fetchUserData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Convert remaining time to minutes and seconds
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <div className="flex justify-center items-center mt-32">
            <div className="bg-white rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2 xl:w-2/3 px-8">
                {/* Left side - Booking Details */}
                <div className="mt-6 flex justify-center mb-3">
                    <p className="text-red-500 font-semibold bg-red-200 rounded-lg w-44 text-center">Remaining Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                </div>
                <div className='flex flex-col md:flex-row '>
                    <div className="mb-6 md:w-1/2 pr-4">
                        <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
                        <div className="flex  mb-2">
                            <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${tempTicket.movieId?.image}`} alt="Movie Poster" className="w-auto h-52 mr-4 rounded-md shadow-md" />
                            <div>
                                <p className="font-semibold text-xl">{tempTicket.movieId?.moviename}</p>
                                <p className="text-gray-600 mt-2"><span className="font-semibold text-black">Date :</span> {formatDate(tempTicket.showId?.date)}</p>
                                <p className="text-gray-600"><span className="font-semibold text-black">Starting Time :</span> {formatTime(tempTicket.showId?.startTime)}</p>
                                {tempTicket.seats && ( // Check if tempTicket.seats is not null or undefined
                                    <p className="text-gray-600"><span className="font-semibold text-black">Seats :</span>
                                        {tempTicket.seats.map((seat, index) => (
                                            <span key={seat.seatNumber}> {seat.seatNumber}{index !== tempTicket.seats.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600"><span className="font-semibold text-black">Theater:</span> {`${tempTicket.theaterId?.name} (${tempTicket.theaterId?.address.district},${tempTicket.theaterId?.address.country})`}</p>
                            <div className="bg-gray-300 text-gray-600 py-1 rounded-md h-20 w-20 text-center mt-5">
                                <div className='font-semibold text-3xl my-1'>{tempTicket.seatCount}</div>
                                <span className='font-medium text-base'>
                                    {tempTicket.seatCount > 1 ? 'Tickets' : 'Ticket'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Amount Details */}
                    <div className="mb-6 md:w-1/2 pl-4">
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
                        <div className="flex justify-between mb-2">
                            <p className="text-gray-600">Silver Seats ({tempTicket.seatCount} x {tempTicket.adminShare})</p>
                            <p className="text-gray-600">₹{tempTicket.seatCount * tempTicket.adminShare}</p>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between">
                            <p className="font-semibold">Total</p>
                            <p className="font-semibold">₹{tempTicket.total}</p>
                        </div>
                        <div className=" mt-6">
                            <h3 className="text-lg font-semibold mb-2">Select Payment Option</h3>
                            <div className="">
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Stripe"
                                            checked={paymentOption === 'Stripe'}
                                            onChange={() => setPaymentOption('Stripe')}
                                            className="mr-2"
                                        />
                                        Pay with Stripe
                                    </label>
                                </div>
                                {userDetails && ( // Check if userDetails is not null
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                value="Wallet"
                                                checked={paymentOption === 'Wallet'}
                                                onChange={() => setPaymentOption('Wallet')}
                                                className="mr-2"
                                            />
                                            Pay with Wallet (₹{userDetails.wallet})
                                        </label>
                                    </div>
                                )}
                                <button onClick={handleProceedPay} className="mt-5 bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
}

export default ShowCheckout;
