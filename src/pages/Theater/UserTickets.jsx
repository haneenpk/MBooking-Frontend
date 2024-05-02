import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";

function UserTickets() {
    // Dummy data for displaying tickets
    const [tickets, setTickets] = useState([]);

    const formatTime = (time) => {
        if (!time) return ''; // Check if time is undefined
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    useLayoutEffect(async () => {
        const theaterId = localStorage.getItem('theaterData');

        const response = await Axios.get(`/api/theater/Tickets/${theaterId}`);
        console.log(response.data.data);
        setTickets(response.data.data)
        // Check if the user is blocked and navigate to login if blocked
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Users Tickets</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-200 px-1 py-2">Username</th>
                            <th className="border border-gray-200 px-1 py-2">Movie Image</th>
                            <th className="border border-gray-200 px-4 py-2">Movie Name</th>
                            <th className="border border-gray-200 px-4 py-2">Screen Name</th>
                            <th className="border border-gray-200 px-4 py-2">Seats</th>
                            <th className="border border-gray-200 px-4 py-2">Tickets</th>
                            <th className="border border-gray-200 px-4 py-2">Date</th>
                            <th className="border border-gray-200 px-4 py-2">Starting Time</th>
                            <th className="border border-gray-200 px-4 py-2">Payment Method</th>
                            <th className="border border-gray-200 px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td className="border border-gray-200 px-4 py-2">{ticket.userId.username}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${ticket.movieId.image}`} alt={ticket.movieName} className="w-16 h-auto" />
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{ticket.movieId.moviename}</td>
                                <td className="border border-gray-200 px-4 py-2">{ticket.screenId.name}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    {ticket.seats.map((seat, index) => (
                                        <span key={seat.seatNumber}> {seat.seatNumber}{index !== ticket.seats.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">{ticket.seatCount}</td>
                                <td className="border border-gray-200 px-4 py-2">{new Date(ticket.showId.date).toLocaleDateString()}</td>
                                <td className="border border-gray-200 px-4 py-2">{formatTime(ticket.showId.startTime)}</td>
                                <td className="border border-gray-200 px-4 py-2">{ticket.paymentMethod}</td>
                                <td className={`border border-gray-200 px-4 py-2 ${ticket.isCancelled ? 'text-red-500' : 'text-black'}`}>{ticket.isCancelled ? "Cancelled" : "Booked"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserTickets;
