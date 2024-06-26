import React, { useEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import ChartOne from '../../components/Theater/Charts/ChartOne';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

function TheaterDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const theaterId = localStorage.getItem('theaterData');
        const response = await Axios.get(`/api/theater/Tickets/${theaterId}`);
        setTickets(response.data.data);
        setLoading(false); // Set loading to false once data is fetched
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

  let todayBookedTickets = 0;

  for (let i = 0; i < todayBooked.length; i++) {
    todayBookedTickets += todayBooked[i].seatCount;
  }

  // Calculate monthly booked tickets
  const thisMonth = new Date();
  const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0); // Get the last day of the current month
  const monthlyTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    return ticketDate >= firstDayOfMonth && ticketDate <= lastDayOfMonth;
  });

  let monthlyBookedTickets = 0;
  
  for (let i = 0; i < monthlyTickets.length; i++) {
    monthlyBookedTickets += monthlyTickets[i].seatCount;
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

  // Chart data
  const chartData = {
    labels: ['Booked Tickets'],
    datasets: [{
      label: 'Tickets',
      data: [monthlyBookedTickets],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    // Destroy previous chart instance
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create new chart instance
    const ctx = document.getElementById('myChart');
    if (ctx) {
      ctx.width = 400; // Set canvas width
      ctx.height = 400; // Set canvas height
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
      setChartInstance(newChartInstance);
    }
  }, [monthlyBookedTickets]);

  return (
    <div className="p-6">
      
      {loading ? (
        <LoadingSpinner />
      ) : (
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
      )}
      {/* Chart */}
      <div className="bg-white shadow-lg rounded-md p-6">
        <h3 className="text-lg font-semibold mb-2">This Year Booked Tickets</h3>
        <ChartOne />
      </div>
    </div>
  );
}

export default TheaterDashboard;
