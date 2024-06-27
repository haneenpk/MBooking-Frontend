import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Axios from "../../api/shared/instance";
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Show = () => {
    const theaterId = localStorage.getItem("theaterData");
    const [dates, setDates] = useState([]);
    const [shows, setShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setLoading] = useState(true); // State to track loading status
    const [open, setOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null); // State to track the selected show for action

    const handleOpen = (show) => {
        setSelectedShow(show);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedShow(null);
        setOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

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
            response.data.FirstShow[i].screen = response3.data.data.name;
            response.data.FirstShow[i].moviename = response2.data.data.moviename;
            response.data.FirstShow[i].image = response2.data.data.image;
        }
        setShows(response.data.FirstShow);
        setSelectedDate(date);
    };

    async function fetchDate() {
        try {
            const response = await Axios.get(`/api/theater/shows/first/${theaterId}`);
            setDates(response.data.dates);
            if (response.data.dates.length > 0) {
                handleDate(response.data.dates[0]);
            }
        } catch (error) {
            console.error("Error fetching theaters:", error);
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
    }

    async function handleDelete() {
        try {
            await Axios.delete(`/api/theater/show/delete/${selectedShow._id}`);
            fetchDate();
            handleClose(); // Close the modal after deletion
        } catch (error) {
            console.error("Error deleting show:", error);
        }
    }

    useEffect(() => {
        fetchDate();
    }, [theaterId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="px-8">
            <h2 className="text-2xl font-bold mb-4 mt-5">Shows</h2>
            <NavLink to="/theater/show/add">
                <Button>Add Show</Button>
            </NavLink>
            <div className="flex space-x-4 mb-4 mt-5">
                {dates.map((dateString, index) => {
                    const { month, day } = formatDate(dateString);
                    const isSelected = selectedDate === dateString;
                    const bgColor = isSelected ? 'bg-blue-500' : 'bg-blue-300';
                    const dynamicClassName = `${bgColor} text-white px-4 py-1 rounded-md cursor-pointer transition duration-100 hover:bg-blue-500`;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shows.map((show) => (
                    <div key={show._id} className="border bg-white shadow-md rounded-lg p-4 flex space-x-4 mb-4">
                        <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${show.image}`} alt={show.moviename} className="rounded-md h-56 " />
                        <div>
                            <h2 className="text-xl font-semibold">{show.moviename}</h2>
                            <p>Screen: {show.screen}</p>
                            <p>Date: {new Date(show.date).toLocaleDateString()}</p>
                            <p>Time: {formatTime(show.startTime)} - {formatTime(show.endTime)}</p>
                            <p>Total Seats: {show.totalSeatCount}</p>
                            <p>Available Seats: {show.availableSeatCount}</p>
                            <div className="flex mt-3">
                                <NavLink to={`/theater/show/edit?showId=${show._id}`}>
                                    <Button size='sm' color='blue' variant='text'><FaEdit className='ml-1' size={22} /></Button>
                                </NavLink>
                                <Button className='flex justify-end' size='sm' color='red' variant='text' onClick={() => handleOpen(show)}><MdDelete size={22} /></Button>
                            </div>
                        </div>
                    </div>
                ))}
                {shows.length === 0 && <p>No shows available for the selected date.</p>}
            </div>
            {selectedShow && (
                <Dialog open={open} handler={handleClose} size='sm'>
                    <DialogHeader>Confirm Action</DialogHeader>
                    <DialogBody>
                        Are you sure you want to delete the "{selectedShow.moviename}"?
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleClose}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button variant="gradient" color="green" onClick={handleDelete}>
                            <span>Confirm</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </div>
    );
};

export default Show;
