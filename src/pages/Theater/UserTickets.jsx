import React, { useEffect, useState } from 'react';
import Axios from "../../api/shared/instance";

function UserTickets() {
    const [tickets, setTickets] = useState([]);

    const formatTime = (time) => {
        if (!time) return '';
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const theaterId = localStorage.getItem('theaterData');
                const response = await Axios.get(`/api/theater/Tickets/${theaterId}`);
                setTickets(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTickets();
    }, []);

    return (
        <div className="px-8">
            <h2 className="text-2xl font-bold mb-4 mt-5">Users Tickets</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200 bg-white rounded-md shadow-md">
                    <thead className="bg-gray-500 text-white">
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
                            <tr key={ticket._id}> {/* Added key prop */}
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
