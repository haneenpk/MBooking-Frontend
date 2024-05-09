import React, { useState, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let theaterId = queryParams.get("theaterId");
    let theaterName = queryParams.get("name");

    let role;

    if (location.pathname.startsWith("/admin/theater-screens")) {
        role = "admin"
    } else {
        role = "theater"
    }

    useLayoutEffect(() => {

        const fetchTheaterData = async (theaterId) => {
            try {

                if (!theaterId) {
                    navigate("/theater/login");
                    return;
                }

                const response = await Axios.get(`/api/theater/get/${theaterId}`);
                setIsBlocked(response.data.data.isBlocked);

                const responseScreen = await Axios.get(`/api/theater/screens/${theaterId}`);

                setListScreen(responseScreen.data.data); // Correct the state variable name
            } catch (error) {
                setError(error);
            }
        };

        const fetchTheaterDataAdmin = async (theaterId) => {
            try {

                const responseScreen = await Axios.get(`/api/admin/screens/${theaterId}`);
                setIsBlocked(false)

                console.log(responseScreen);

                setListScreen(responseScreen.data.data); // Correct the state variable name
            } catch (error) {
                setError(error);
            }
        };

        if (location.pathname.startsWith("/admin/theater-screens")) {
            role = "admin"
            fetchTheaterDataAdmin(theaterId);
        } else {
            role = "theater"
            theaterId = localStorage.getItem('theaterData');
            fetchTheaterData(theaterId);
        }



    }, [navigate]);

    const handleDelete = async (screenId) => {
        try {
            await Axios.delete(`/api/theater/screens/delete/${screenId}`);
            // If delete is successful, update the screen list
            setListScreen(listScreen.filter(screen => screen._id !== screenId));
        } catch (error) {
            setError(error);
        }
    };

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
        console.log(role);
        return (
            <div className='px-8'>
                <h2 className="text-2xl font-bold mb-4 mt-5">{role === "admin" ? (<>{theaterName} Theater Screens List</>) : (<>Theater Screens List</>)}</h2>
                {role === "theater" && (
                    <Link to="/theater/screens/add" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Screen
                    </Link>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                    {listScreen.map((screen) => (
                        <div key={screen._id} className="border p-4 rounded-md bg-white shadow-md">
                            <h3 className="text-lg font-semibold mb-2">{screen.name}</h3>
                            <p className="text-sm">Rows: {screen.rows}</p>
                            <p className="text-sm">Cols: {screen.cols}</p>
                            <p className="text-sm">Seats Count: {screen.seatsCount}</p>
                            <div className="flex justify-between mt-2">
                                <NavLink to={role === "theater" ? `/theater/screen/edit?seatId=${screen.seatId}&role=${role}` : `/admin/theater-screen/edit?seatId=${screen.seatId}&role=${role}&theaterId=${theaterId}`} className="text-blue-500 hover:underline">
                                    Edit seats
                                </NavLink>
                                {role === "theater" && (
                                    <button onClick={() => handleDelete(screen._id)} className="text-red-500 hover:underline">Delete</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null; // return null if isBlocked
};

export default TheaterScreensList;
