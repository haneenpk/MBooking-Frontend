import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import { useDispatch } from "react-redux";
import Axios from "../../api/shared/instance";

function ShowTime() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [theaters, setTheaters] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // State to keep track of the selected date
    const [userLocation, setUserLocation] = useState({})
    const [movie, setMovie] = useState({})

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const movieId = queryParams.get("movieId");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

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

    const formatTime = (time) => {
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    const handleDate = async (date) => {
        
        const response = await Axios.get(`/api/user/selectShowTime?country=${userLocation.country}&district=${userLocation.district}&movieId=${movieId}&date=${date}`);

        const theaterPromises = response.data.selectedShow.map(show => handleTheaterId(show.theaterId));

        // Wait for all theater name promises to resolve
        const theaterNames = await Promise.all(theaterPromises);

        // Combine theater names with corresponding shows
        const groupedShows = response.data.selectedShow.map((show, index) => ({
            ...show,
            theaterName: theaterNames[index]
        }));

        const groupedTheaters = await groupShowsByTheater(groupedShows); // Await here

        setSelectedDate(date);

        console.log(groupedTheaters);

        setTheaters(groupedTheaters);
    }

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const userId = localStorage.getItem('userData');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const response = await Axios.get(`/api/user/get/${userId}`);
                setUserLocation({
                    district : response.data.data.district,
                    country : response.data.data.country
                })
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

                setDates(response2.data.dates)

                setSelectedDate(response2.data.dates[0]);

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

        const fetchMovie = async () => {
            try {
                const response = await Axios.get(`/api/user/movie/get/${movieId}`);
                setMovie(response.data.data)
            } catch (error) {
                console.log(error);
            }
        };

        fetchShowData();
        fetchMovie();
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
        <div className="container mx-auto mt-24 flex bg-gray-100">
            <div className="mr-8">
                <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="w-64 rounded-md h-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">{movie.moviename}</h1>
            </div>
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-4">Select Showtime</h1>
                <div className="flex space-x-4 mb-4">
                    {dates.map((dateString, index) => {
                        const { month, day } = formatDate(dateString);
                        const isSelected = selectedDate === dateString;
                        const bgColor = isSelected ? 'bg-blue-500' : 'bg-blue-300';
                        const dynamicClassName = `${bgColor} text-black text-white px-4 py-1 rounded-md cursor-pointer transition duration-300 hover:bg-blue-500`;
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
                <div>
                    {theaters.map(([theaterName, shows]) => (
                        <div className="flex mt-5 w-full h-20 rounded-md bg-white shadow-md p-3" key={theaterName}>
                            <div className='w-32'> 
                                <h2 className="text-xl font-semibold mt-4">{theaterName}</h2>
                            </div>
                            <div className="ml-8 flex">
                                {shows.map((show, index) => (
                                    <NavLink to={`/show/seats?seatId=${show.seatId}&showId=${show._id}`} key={index} className="text-center px-3 py-1 bg-blue-500 text-white rounded-lg mr-3 hover:bg-blue-600 hover:shadow-md transition duration-10000 ease-in-out">
                                        <p className="text-base font-semibold">{formatTime(show.startTime)}</p>
                                        <span className="text-base">{show.screenId.name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShowTime;
