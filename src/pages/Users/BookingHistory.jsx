import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Axios from "../../api/shared/instance";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import { GiTicket } from "react-icons/gi";

const BookingHistory = () => {
    const [tickets, setTickets] = useState([]);
    const [cancelTicketId, setCancelTicketId] = useState(""); // State to store the ticket ID to cancel
    const [isLoading, setLoading] = useState(true); // State to track loading status
    const [open, setOpen] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null); // State to track the selected theater for action

    const formatTime = (time) => {
        if (!time) return ''; // Check if time is undefined
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    const fetchTempTicket = async () => {
        try {
            const userId = localStorage.getItem('userData');
            let response = await Axios.get(`/api/user/booking-history/${userId}`);
            console.log(response.data.data);
            setTickets(response.data.data);
            setLoading(false)
        } catch (error) {
            console.error(error);
            setLoading(false)
        }
    };

    useLayoutEffect(() => {
        fetchTempTicket();
    }, []);

    const todayDate = new Date().toISOString().split('T')[0];

    const handleCancelTicket = (ticketId) => {
        // Set the ticket ID to cancel when the cancel button is clicked
        setCancelTicketId(ticketId);
        setOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            // Handle confirmation logic here, e.g., make an API call to cancel the ticket
            console.log("Cancelled ticket with ID:", cancelTicketId);
            let response = await Axios.get(`/api/user/ticket/cancel/${cancelTicketId}`);
            if (response) {
                toast.success('Cancelled Successfully')
                fetchTempTicket();
            }
        } catch (error) {
            console.error(error);
        }
        setCancelTicketId("");
        setOpen(false);
    };

    const handleCloseModal = () => {
        // Reset the cancelTicketId state when the modal is closed without confirmation
        setCancelTicketId("");
        setOpen(false);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="mx-auto py-5 px-10">
            <div className='flex justify-center gap-x-2 bg-white w-fit p-2 px-4 h-12 rounded-full shadow-md mx-auto'>
                <GiTicket size={30} />
                <h1 className="text-3xl font-bold">Tickets</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className={`rounded-lg shadow-md ${ticket.isCancelled ? 'bg-red-100' : 'bg-white'}`}>
                        <div className='flex justify-center mt-3'>
                            <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${ticket.movieId.image}`} alt={ticket.movieName} className=" h-44 object-cover rounded-md shadow-xl shadow-blue-gray-900/50" />
                        </div>
                        <div className="p-4">
                            {ticket.isCancelled && (
                                <h3 className="text-xl font-semibold mb-1 text-center text-red-500">Cancelled</h3>
                            )}
                            <h2 className="text-xl font-semibold mb-2">{ticket.movieId.moviename}</h2>
                            <p className="text-gray-600">{ticket.theaterId.name}</p>
                            <p className="text-gray-600">{`(${ticket.theaterId.address.district},${ticket.theaterId.address.country})`}</p>
                            <p className="text-gray-600">{ticket.screenId.name}</p>
                            <p className="text-gray-600">
                                Seats :
                                {ticket.seats.map((seat, index) => (
                                    <span key={seat.seatNumber}> {seat.seatNumber}{index !== ticket.seats.length - 1 ? ', ' : ''}</span>
                                ))}
                            </p>
                            <p className="text-gray-600">Tickets : {ticket.seatCount}</p>
                            <p className="text-gray-600">Date : {new Date(ticket.showId.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Starting Time : {formatTime(ticket.showId.startTime)}</p>
                            <p className="text-gray-600">Payment Method : {ticket.paymentMethod}</p>
                            <div className='flex justify-center mt-3'>
                                {(ticket.showId.date > todayDate && ticket.isCancelled === false) && (
                                    <>
                                        <Button onClick={() => handleCancelTicket(ticket._id)}>Cancel</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Dialog open={open} handler={handleCloseModal} size='sm'>
                <DialogHeader>Confirm Cancellation</DialogHeader>
                <DialogBody>
                    Are you sure you want to cancel this ticket?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleCloseModal}
                        className="mr-1"
                    >
                        <span>Close</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleConfirmCancel}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default BookingHistory;
