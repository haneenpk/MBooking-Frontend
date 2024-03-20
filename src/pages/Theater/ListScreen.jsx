import React, { useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from "../../api/shared/instance";
import { useNavigate } from 'react-router-dom';
import { resetTheaterState } from '../../redux/slices/theaterSlice';

const TheaterScreensList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState(null);
    const [listScreen, setListScreen] = useState([]); // Initialize as an empty array
    const [isBlocked, setIsBlocked] = useState(true);

    useLayoutEffect(() => {
        const theaterId = localStorage.getItem('theaterData');

        const fetchTheaterData = async () => {
            try {
                if (!theaterId) {
                    navigate("/theater/login");
                    return;
                }

                const response = await Axios.get(`/api/theater/get/${theaterId}`);
                setIsBlocked(response.data.data.isBlocked);

                const responseScreen = await Axios.get(`/api/theater/screens/${theaterId}`);
                console.log("Screen", responseScreen);
                setListScreen(responseScreen.data.data); // Correct the state variable name
            } catch (error) {
                setError(error);
            }
        };

        fetchTheaterData();

    }, [navigate]);

    if (error) {
        if (error.response && error.response.data.message === "You are blocked") {
            localStorage.removeItem('theaterData');
            localStorage.removeItem('theaterAccessToken');
            dispatch(resetTheaterState());
            console.log("Your account is blocked");
            navigate("/theater/login")
        }
    }

    if (!isBlocked) {
        return (
            <div className='ml-20 mt-'>
                <h2 className="text-2xl font-bold mb-4 mt-5">Theater Screens List</h2>
                <Link to="/theater/screens/add" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Screen
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                    {listScreen.map((screen) => (
                        <div key={screen._id} className="border p-4 rounded-md bg-white">
                            <h3 className="text-lg font-semibold mb-2">{screen.name}</h3>
                            <p className="text-sm">Rows: {screen.rows}</p>
                            <p className="text-sm">Cols: {screen.cols}</p>
                            <p className="text-sm">Seats Count: {screen.seatsCount}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null; // return null if isBlocked
};

export default TheaterScreensList;
