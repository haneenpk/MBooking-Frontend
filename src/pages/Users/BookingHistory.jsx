import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";

const BookingHistory = () => {

    const [tickets, setTickets] = useState([]);
    const [cancelTicketId, setCancelTicketId] = useState(null); // State to store the ticket ID to cancel

    const formatTime = (time) => {
        if (!time) return ''; // Check if time is undefined
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    useLayoutEffect(() => {
        const fetchTempTicket = async () => {
            try {
                const userId = localStorage.getItem('userData');
                let response = await Axios.get(`/api/user/booking-history/${userId}`);
                console.log(response.data.data);
                setTickets(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTempTicket();
    }, []);

    const todayDate = new Date().toISOString().split('T')[0];

    const handleCancelTicket = (ticketId) => {
        // Set the ticket ID to cancel when the cancel button is clicked
        setCancelTicketId(ticketId);
    };

    const handleConfirmCancel = () => {
        // Handle confirmation logic here, e.g., make an API call to cancel the ticket
        console.log("Cancelled ticket with ID:", cancelTicketId);

        // After cancellation, close the modal and reset the cancelTicketId state
        setCancelTicketId(null);
    };

    const handleCloseModal = () => {
        // Reset the cancelTicketId state when the modal is closed without confirmation
        setCancelTicketId(null);
    };

    return (
        <div className="container mx-auto py-8 mt-10">
            <h1 className="text-3xl font-semibold mb-4 text-center">Booking History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className={`border border-gray-200 rounded-lg shadow-md ${ticket.isCancelled ? 'bg-red-200' : ''}`}>
                        <div className='flex justify-center mt-3'>
                            <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${ticket.movieId.image}`} alt={ticket.movieName} className=" h-44 object-cover rounded-md " />
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
                            <p className="text-gray-600">payment Method : {ticket.paymentMethod}</p>
                            <div className='flex justify-center mt-3'>
                                {(ticket.showId.date > todayDate && ticket.isCancelled === false) && (
                                    <>
                                        <button className="hover:bg-blue-600 bg-blue-500 text-white border rounded-md p-2 cursor-pointer" onClick={() => handleCancelTicket(ticket.id)}>Cancel</button>
                                        {cancelTicketId === ticket.id && (
                                            <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-black bg-opacity-50">
                                                <div className="bg-white p-5 rounded-md shadow-md">
                                                    <p className="text-xl font-semibold mb-3">Are you sure you want to cancel this ticket?</p>
                                                    <div className="flex justify-center">
                                                        <button className="bg-red-500 text-white rounded-md px-4 py-2 mr-2" onClick={handleConfirmCancel}>Confirm</button>
                                                        <button className="bg-gray-400 text-black rounded-md px-4 py-2" onClick={handleCloseModal}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingHistory;
