import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Axios from "../../api/shared/instance";
import { useLocation } from 'react-router-dom';
import {
    Card,
    Button
} from "@material-tailwind/react";

function BookingSuccess() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tempTicketId = queryParams.get("tempTicketId");

    const [isLoading, setLoading] = useState(true); // State to track loading status

    useLayoutEffect(() => {
        const fetchTempTicket = async () => {
            try {
                let response = await Axios.get(`/api/user/booking/save/${tempTicketId}`);
                toast.success('Successfully Booking')
                // setTempTicket(response.data.data);
                setLoading(false)
            } catch (error) {
                console.error(error);
                setLoading(false)
            }
        };

        fetchTempTicket();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex justify-center items-center">
            <Card className="bg-white p-8 w-1/2 mt-24 h-96">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">Booking Confirmed!</h1>
                <p className="text-lg mb-6 text-center text-gray-700">Thank you for booking with us.</p>
                <p className="text-lg mb-6 text-center text-gray-700">You're all set. Enjoy the show!</p>
                <NavLink to="/booking-history" className="text-center block mt-16">
                    <Button className='rounded-full' color='green'>Show Tickets</Button>
                </NavLink>
            </Card>
        </div>
    );
}

export default BookingSuccess;
