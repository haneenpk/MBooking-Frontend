import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Axios from "../../api/shared/instance";

const Show = () => {
    const theaterId = localStorage.getItem("theaterData");
    const [dates, setDates] = useState([]);
    const [shows, setShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // State to keep track of the selected date

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

    // Function to format time to 12-hour format with AM/PM
    const formatTime = (time) => {
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    const handleDate = async (date) => {
        const response = await Axios.get(`/api/theater/shows/${theaterId}?date=${date}`);
        for (let i = 0; i < response.data.FirstShow.length; i++) {
            const response2 = await Axios.get(`/api/theater/movie/get/${response.data.FirstShow[i].movieId}`);
            const response3 = await Axios.get(`/api/theater/screens/get/${response.data.FirstShow[i].screenId}`);
            response.data.FirstShow[i].screen = response3.data.data.name
            response.data.FirstShow[i].moviename = response2.data.data.moviename
            response.data.FirstShow[i].image = response2.data.data.image
        }
        setShows(response.data.FirstShow);
        setSelectedDate(date); // Set the selected date
    };

    async function fetchDate() {
        try {
            const response = await Axios.get(`/api/theater/shows/first/${theaterId}`);
            setDates(response.data.dates);
            // Select the first date by default
            if (response.data.dates.length > 0) {
                handleDate(response.data.dates[0]);
            }
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    }

    async function handleDelete(showId) {
        try {
            console.log("Delete movie:", showId);
            const response = await Axios.delete(`/api/theater/show/delete/${showId}`);
            console.log(response);
            fetchDate();
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    }

    useEffect(() => {
        fetchDate();
    }, [theaterId]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold ">Shows</h2>
            <NavLink to="/theater/show/add" className="my-3 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Show
            </NavLink>
            <div className="flex space-x-4 mb-4 mt-2">
                {dates.map((dateString, index) => {
                    const { month, day } = formatDate(dateString);
                    const isSelected = selectedDate === dateString;
                    const bgColor = isSelected ? 'bg-blue-400' : 'bg-blue-300';
                    console.log(bgColor);
                    const dynamicClassName = `${bgColor} text-black px-4 py-1 rounded-md`;
                    return (
                        <button
                            key={index}
                            onClick={() => handleDate(dateString)}
                            className={dynamicClassName}
                        >
                            <span className='font-semibold text-lg'>{month}</span>
                            <div className='font-semibold'>{day}</div>
                        </button>
                    );
                })}
            </div>

            {/* Show listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shows.map((show) => (
                    <div key={show._id} className="border border-gray-200 rounded-lg p-4 flex space-x-4 mb-4">
                        <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${show.image}`} alt={show.moviename} className="rounded-sm mb-4" style={{ maxHeight: "130px", maxWidth: "120px", }} />
                        <div>
                            <h2 className="text-lg font-semibold">{show.moviename}</h2>
                            <p>Screen: {show.screen}</p>
                            <p>Date: {new Date(show.date).toLocaleDateString()}</p>
                            <p>Time: {formatTime(show.startTime)} - {formatTime(show.endTime)}</p>
                            <p>Total Seats: {show.totalSeatCount}</p>
                            <p>Available Seats: {show.availableSeatCount}</p>
                            {/* Add more details as needed */}
                            <div className="flex justify-between mt-2">
                                <NavLink to={`/theater/show/edit?showId=${show._id}`} className="text-blue-500 hover:underline">
                                    Edit show
                                </NavLink>
                                <button onClick={() => handleDelete(show._id)} className="text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
                {shows.length === 0 && <p>No shows available for the selected date.</p>}
            </div>
        </div>
    );
};

export default Show;
