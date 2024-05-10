import Axios from "../../api/shared/instance";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

function UpcomingDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const upcomingId = queryParams.get("upcomingId");

    const [upcomingMovie, setUpcomingData] = useState({})

    const [isLoading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("ddd");
                const responseScreen = await Axios.get(`/api/user/upcoming/get/${upcomingId}`);

                let upcoming = responseScreen.data.data;

                upcoming.languages = upcoming.languages.join(',');
                upcoming.genre = upcoming.genre.join(',');

                console.log(upcoming);

                setUpcomingData(upcoming);
                setLoading(false)
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }

        fetchData(); // Call the async function immediately

    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="mx-auto px-4 py-8 mt-24">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden flex">
                <div className="w-1/3 m-10">
                    <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${upcomingMovie.image}`} alt={upcomingMovie.moviename} className="w-full h-auto rounded-md" />
                </div>
                <div className="w-2/3 p-6">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">{upcomingMovie.moviename}</h2>
                    <p className="text-gray-600 mb-2">Release Date: {new Date(upcomingMovie.releaseDate).toLocaleDateString()}</p>
                    <p className="text-gray-700">{upcomingMovie.description}</p>
                    <div className="mb-4 mt-1">
                        <h3 className="text-lg font-semibold mb-2">Languages:</h3>
                        <ul className="list-disc ml-4">
                            {upcomingMovie.languages && upcomingMovie.languages.split(',').map((language, index) => (
                                <li key={index}>{language}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Genre:</h3>
                        <ul className="list-disc ml-4">
                            {upcomingMovie.genre && upcomingMovie.genre.split(',').map((genreItem, index) => (
                                <li key={index}>{genreItem}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UpcomingDetail;
