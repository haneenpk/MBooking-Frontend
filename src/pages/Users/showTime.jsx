import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import { useDispatch } from "react-redux";
import Axios from "../../api/shared/instance";

function ShowTime() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [theaters, setTheaters] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const movieId = queryParams.get("movieId");

    const handleTheaterId = async (theaterId) => {
        try {
            const theaterData = await Axios.get(`/api/user/get/theater/${theaterId}`);
            console.log(theaterData.data.data.name);
            return theaterData.data.data.name;
        } catch (error) {
            console.error("Error fetching theater data:", error);
            return "Unknown Theater";
        }
    };

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const userId = localStorage.getItem('userData');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const response = await Axios.get(`/api/user/get/${userId}`);
                const response2 = await Axios.get(`/api/user/showTime?country=${response.data.data.country}&district=${response.data.data.district}&movieId=${movieId}`);

                // Collect promises for fetching theater names
                const theaterPromises = response2.data.selectedShow.map(show => handleTheaterId(show.theaterId));

                // Wait for all theater name promises to resolve
                const theaterNames = await Promise.all(theaterPromises);

                // Combine theater names with corresponding shows
                const groupedShows = response2.data.selectedShow.map((show, index) => ({
                    ...show,
                    theaterName: theaterNames[index]
                }));

                const groupedTheaters = await groupShowsByTheater(groupedShows); // Await here

                setTheaters(groupedTheaters);
            } catch (error) {
                if (error && error.response && error.response.data.message === "You are blocked") {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('userAccessToken');
                    dispatch(resetUserState());
                    console.log("Your account is blocked");
                    navigate("/login");
                }
            }
        };

        fetchShowData();
    }, [navigate, dispatch, movieId]);

    const groupShowsByTheater = async (shows) => {
        const theatersMap = new Map();
        // Map each show to a Promise that fetches theater data
        const theaterPromises = shows.map(async (show) => {
            const { theaterId, ...rest } = show;
            try {
                const theaterData = await Axios.get(`/api/user/get/theater/${theaterId}`);
                const theaterName = theaterData.data.data.name;
                if (!theatersMap.has(theaterName)) {
                    theatersMap.set(theaterName, []);
                }
                theatersMap.get(theaterName).push(rest);
            } catch (error) {
                console.error("Error fetching theater data:", error);
            }
        });

        // Wait for all theater data promises to resolve
        await Promise.all(theaterPromises);

        // Convert the map to an array of entries
        return Array.from(theatersMap.entries());
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Select Showtime</h1>
            <div className="grid grid-cols-2 gap-8">
                {theaters.map(([theaterName, shows]) => (
                    <div key={theaterName}>
                        <h2 className="text-xl font-semibold mb-4">Theater: {theaterName}</h2>                       
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {shows.map((show, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <p className="text-lg font-semibold">{`${show.startTime.hour}:${show.startTime.minute} - ${show.endTime.hour}:${show.endTime.minute}`}</p>
                                    <p className="text-sm text-gray-600 mt-1">{`Available Seats: ${show.availableSeatCount}/${show.totalSeatCount}`}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShowTime;
