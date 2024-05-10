import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import { editUpcomingSchema } from "../../validations/adminValidations/editUpcoming";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const EditUpcomingMovie = () => {

    const navigate = useNavigate()

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const upcomingId = queryParams.get("upcomingId");

    const [movieData, setMovieData] = useState({});
    const [upcomingImage, setUpcomingImage] = useState("");

    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState("");

    const [isLoading, setLoading] = useState(true); // State to track loading status

    const handleChange = (e) => {
        handleInputChange(e, movieData, setMovieData, setServerResponse, setErrors);
    };

    const handleUpdate = async () => {
        try {

            await editUpcomingSchema.validate(movieData, { abortEarly: false });
            console.log(upcomingId);

            const response = await Axios.put(`/api/admin/upcoming/edit/${upcomingId}`, movieData);
            console.log(response);
            navigate('/admin/upcoming')
        } catch (error) {
            handleFormErrors(error, setErrors, setServerResponse);
        }
    };

    const handleImageChange = async (event) => {

        try {

            const formData = new FormData();
            formData.append('image', event.target.files[0]);

            const response = await Axios.patch(`/api/admin/upcoming/edit/image/${upcomingId}`, formData);

            fetchUpcomingMovieData()

            console.log(response);

        } catch (error) {
            console.error("Error updating profile picture:", error);
        }

    }

    const fetchUpcomingMovieData = async () => {
        try {

            const responseScreen = await Axios.get(`/api/admin/upcoming/get/${upcomingId}`);

            let upcoming = responseScreen.data.data

            upcoming.languages = upcoming.languages.join(',')
            upcoming.genre = upcoming.genre.join(',')

            setUpcomingImage(upcoming.image)

            delete upcoming.image

            setMovieData(upcoming)

            console.log(upcoming);

            setLoading(false)

        } catch (error) {
            setErrors(error);
            setLoading(false)
        }
    };

    useLayoutEffect(() => {

        fetchUpcomingMovieData();

    }, [])

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-md mx-auto py-5">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Upcoming Movies</h2>
            <div className="mb-4">
                <label htmlFor="moviename" className="block mb-1">Movie Name</label>
                <input type="text" id="moviename" name="moviename" value={movieData.moviename} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder='Movie Name' />
                {errors.moviename &&
                    <FormErrorDisplay error={errors.moviename} />
                }
            </div>
            <div className="mb-4">
                <label htmlFor="languages" className="block mb-1">Languages</label>
                <input type="text" id="languages" name="languages" value={movieData.languages} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder='Movie Languages seperated by coma' />
                {errors.languages &&
                    <FormErrorDisplay error={errors.languages} />
                }
            </div>
            <div className="mb-4">
                <label htmlFor="genre" className="block mb-1">Genre</label>
                <input type="text" id="genre" name="genre" value={movieData.genre} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder='Movie Genre seperated by coma' />
                {errors.genre &&
                    <FormErrorDisplay error={errors.genre} />
                }
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block mb-1">Description</label>
                <textarea id="description" name="description" value={movieData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required placeholder='Short Description of the movie' />
                {errors.description &&
                    <FormErrorDisplay error={errors.description} />
                }
            </div>
            <div className="mb-4">
                <label htmlFor="releaseDate" className="block mb-1">Release Date</label>
                <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    value={movieData.releaseDate ? movieData.releaseDate.substring(0, 10) : ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                {errors.releaseDate &&
                    <FormErrorDisplay error={errors.releaseDate} />
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
            <button onClick={handleUpdate} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Edit Upcoming Movie</button>
            <div className='mt-3'>
                <h1 className="text-xl font-semibold mb-4">Image</h1>
                <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${upcomingImage}`} alt={movieData.moviename} className="h-72 w-64 object-cover rounded-lg" />
                <div className="relative mt-4">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profilePicInput" />
                    <label htmlFor="profilePicInput" className="mb-2 border border-gray-300 rounded-md p-2 cursor-pointer">Update Image</label>
                </div>
            </div>
        </div>
    );
};

export default EditUpcomingMovie;
