import React, { useEffect, useState } from 'react';
import Axios from "../../api/shared/instance";

function TheaterDashboard() {
  const [tickets, setTickets] = useState([]);

  const formatTime = (time) => {
    if (!time) return ''; // Check if time is undefined
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
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // Calculate today's booked tickets
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const todayBooked = tickets.filter(ticket => ticket.createdAt.startsWith(todayFormatted));

  let todayBookedTickets = 0

  for(let i=0; i<todayBooked.length; i++){
    todayBookedTickets += todayBooked[i].seatCount
  }

  // Calculate monthly booked tickets
  const thisMonth = new Date();
  const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0); // Get the last day of the current month
  const monthlyTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate >= firstDayOfMonth && ticketDate <= lastDayOfMonth;
  });

  let monthlyBookedTickets = 0
  
  for(let i=0; i<monthlyTickets.length; i++){
    monthlyBookedTickets += monthlyTickets[i].seatCount
  }

  // Calculate profit for this month and total profit
  let profitThisMonth = 0;
  let totalProfit = 0;

  tickets.forEach(ticket => {
    // Assuming totalPrice is the profit per ticket
    totalProfit += ticket.totalPrice;

    // Check if the ticket was created in the current month
    if (new Date(ticket.createdAt).getMonth() === thisMonth.getMonth()) {
      profitThisMonth += ticket.totalPrice;
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Theater Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-7">
        <div className="bg-white shadow-lg rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">Today's Booked Tickets</h3>
          <p className="text-4xl font-bold text-blue-500">{todayBookedTickets}</p>
        </div>
        <div className="bg-white shadow-lg rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Booked Tickets</h3>
          <p className="text-4xl font-bold text-green-500">{monthlyBookedTickets}</p>
        </div>
        <div className="bg-white shadow-lg rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">Profit This Month</h3>
          <p className="text-4xl font-bold text-yellow-500">₹{profitThisMonth}</p>
        </div>
        <div className="bg-white shadow-lg rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">Total Profit</h3>
          <p className="text-4xl font-bold text-red-500">₹{totalProfit}</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Users Tickets</h2>
      <div className="overflow-x-auto mb-4">
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

export default TheaterDashboard;
