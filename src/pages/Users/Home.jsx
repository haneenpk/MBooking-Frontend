import Axios from "../../api/shared/instance";
import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import { useDispatch } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [availMovies, setAvailMovies] = useState([]);
  const [district, setDistrict] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userData');
        if (!userId) {
          navigate('/login');
          return;
        }
        const response = await Axios.get(`/api/user/get/${userId}`);
        const response1 = await Axios.get(`/api/user/upcomings`);
        const response2 = await Axios.get(`/api/user/movies?country=${response.data.data.country}&district=${response.data.data.district}`);
        setUpcomingMovies(response1.data.data);
        setAvailMovies(response2.data.data);
        setDistrict(response.data.data.district);
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

    fetchUserData();
  }, [navigate, dispatch]);

  const isMovieNewRelease = (releaseDate) => {
    const currentDate = new Date();
    const movieReleaseDate = new Date(releaseDate);
    const timeDifference = currentDate.getTime() - movieReleaseDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    const newReleaseThreshold = 1; // Threshold for considering a movie as a new release (e.g., within the last 7 days)
    console.log("ddd: ", daysDifference);
    return daysDifference <= newReleaseThreshold;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-5 bg-white shadow sm:rounded-lg">
            <h2 className="text-xl font-semibold text-center">Available Shows</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {availMovies.map(movie => (
                <div to={`/user/available?movieId=${movie._id}`} className="overflow-hidden shadow-lg rounded-lg">
                  <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="w-full h-auto" />
                  <div className="p-4">
                    <h3 className="text-gray-800 font-semibold text-lg">{movie.moviename}</h3>
                    <div className="flex space-x-4 mb-4">
                      <div className="mt-4 flex justify-between">
                        <NavLink to={`/available?movieId=${movie._id}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Book Ticket</NavLink>
                      </div>
                      <div>
                        {isMovieNewRelease(movie.releaseDate) && <p className="text-green-500 mt-6 ml-6">New Release</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-5 bg-white shadow sm:rounded-lg">
            <h2 className="text-xl font-semibold text-center">Upcoming Movies</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {upcomingMovies.map(movie => (
                <div key={movie._id} className="overflow-hidden shadow-lg rounded-lg">
                  <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="w-full h-auto" />
                  <div className="p-4">
                    <h3 className="text-gray-800 font-semibold text-lg">{movie.moviename}</h3>
                    <p className="text-gray-600 mt-2">Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
