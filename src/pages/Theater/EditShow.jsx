import React, { useState, useEffect } from 'react';
import Axios from "../../api/shared/instance";
import { addShowSchema } from "../../validations/theaterValidations/addShowSchema";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate, useLocation } from 'react-router-dom';


function EditShow() {

    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const showId = queryParams.get("showId");

    const theaterId = localStorage.getItem("theaterData")

    const [newShow, setNewShow] = useState({
        screenId: '', // Add theaterId field
        movieId: '', // Add movieId field
        startTime: '',
        date: null,
        diamondPrice: '',
        goldPrice: '',
        silverPrice: '',
    });

    const [screens, setScreens] = useState([]);
    const [movies, setMovies] = useState([]);
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");
    const [updateResponse, setUpdateResponse] = useState("")

    const formatTime = (time) => {
        const hours = time.hour > 12 ? time.hour - 12 : time.hour;
        const period = time.hour >= 12 ? 'PM' : 'AM';
        return `${hours.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}${period}`;
    };

    const handleChange = (e) => {
        handleInputChange(e, newShow, setNewShow, setServerResponse, setErrors);
    };

    const handleEditShow = async (e) => {
        e.preventDefault();

        try {
            // Validate formData against the signup schema
            await addShowSchema.validate(newShow, { abortEarly: false });

            setErrors({}); // Clear previous validation errors

            console.log(newShow);

            // If validation passes, proceed with signup
            const response = await Axios.post(`/api/theater/show/edit/${showId}`, newShow);
            console.log(response.data.message);
            setUpdateResponse("Update Successfully")

            setTimeout(() => {
                navigate("/theater/show");
            },1000)

        } catch (error) {
            console.log(error);
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    useEffect(() => {
        // Fetch list of theaters
        async function fetchScreens() {
            try {
                const response = await Axios.get(`/api/theater/screens/${theaterId}`);
                setScreens(response.data.data);
            } catch (error) {
                console.error("Error fetching theaters:", error);
            }
        }

        // Fetch list of movies
        async function fetchMovies() {
            try {
                const response = await Axios.get(`/api/theater/movies`);
                setMovies(response.data.data);
                console.log(response.data.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }

        async function fetchShow() {
            try {
                const response = await Axios.get(`/api/theater/show/edit/${showId}`);
                console.log(response.data);
                let obj = {
                    screenId: response.data.editShow.screenId, // Add theaterId field
                    movieId: response.data.editShow.movieId, // Add movieId field
                    startTime: formatTime(response.data.editShow.startTime),
                    date: new Date(response.data.editShow.date).toISOString().substr(0, 10),
                    diamondPrice: `${response.data.editShowScreen.diamond.price}`,
                    goldPrice: `${response.data.editShowScreen.gold.price}`,
                    silverPrice: `${response.data.editShowScreen.silver.price}`,
                }
                console.log(obj);
                setNewShow(obj)
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }

        fetchShow()
        fetchScreens();
        fetchMovies();
    }, []);

    return (
        <div className='px-14 my-5'>
            <h3 className="text-xl font-semibold mb-2">Edit Show</h3>
            <div className='my-3'>
                <label htmlFor="screenId" className="block text-sm font-medium text-gray-700">Select Screen</label>
                <select name="screenId" id="screenId" value={newShow.screenId} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
                    <option value="">Select a Screen</option>
                    {screens.map(screen => (
                        <option key={screen.id} value={screen._id}>{screen.name}</option>
                    ))}
                </select>
                {errors.screenId &&
                    <FormErrorDisplay error={errors.screenId} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="movieId" className="block text-sm font-medium text-gray-700">Select Movie</label>
                <select name="movieId" id="movieId" value={newShow.movieId} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full">
                    <option value="">Select a movie</option>
                    {movies.map(movie => (
                        <option key={movie.id} value={movie._id}>{movie.moviename}</option>
                    ))}
                </select>
                {errors.movieId &&
                    <FormErrorDisplay error={errors.movieId} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="text" name="startTime" id="startTime" placeholder="hh:mmAM/PM (e.g., 11:00AM)" value={newShow.startTime} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                {errors.startTime &&
                    <FormErrorDisplay error={errors.startTime} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" id="date" value={newShow.date} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                {errors.date &&
                    <FormErrorDisplay error={errors.date} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="diamondPrice" className="block text-sm font-medium text-gray-700">Diamond Price</label>
                <input type="text" name="diamondPrice" id="diamondPrice" placeholder="diamond price" value={newShow.diamondPrice} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                {errors.diamondPrice &&
                    <FormErrorDisplay error={errors.diamondPrice} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="goldPrice" className="block text-sm font-medium text-gray-700">Gold Price</label>
                <input type="text" name="goldPrice" id="goldPrice" placeholder="gold price" value={newShow.goldPrice} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                {errors.goldPrice &&
                    <FormErrorDisplay error={errors.goldPrice} />
                }
            </div>
            <div className='my-3'>
                <label htmlFor="silverPrice" className="block text-sm font-medium text-gray-700">Silver Price</label>
                <input type="text" name="silverPrice" id="silverPrice" placeholder="silver price" value={newShow.silverPrice} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full appearance-none" />
                {errors.silverPrice &&
                    <FormErrorDisplay error={errors.silverPrice} />
                }
            </div>
            {serverResponse && (
                <div
                    className={`mt-2 p-2 text-center font-bold text-red-600`}
                    role="alert"
                >
                    {serverResponse.message}
                </div>
            )}
            <button onClick={handleEditShow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2">Add</button>
            {updateResponse && (
                <div
                    className={`mt-2 p-2 font-bold text-green-600`}
                    role="alert"
                >
                    {updateResponse}
                </div>
            )}

        </div>
    )
}

export default EditShow;
