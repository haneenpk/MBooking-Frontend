import React, { useState, useEffect } from 'react';
import { toast } from 'sonner'
import { useNavigate, NavLink } from 'react-router-dom';
import { resetUserState } from '../../redux/slices/userSlice';
import { useDispatch } from "react-redux";
import Axios from "../../api/shared/instance";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [availMovies, setAvailMovies] = useState([]);
  const [district, setDistrict] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedReleaseDate, setSelectedReleaseDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userData');
        if (!userId) {
          navigate('/login');
          return;
        }
        const response = await Axios.get(`/api/user/get/${userId}`);
        const country = response.data.data.country;
        const district = response.data.data.district;
        const response1 = await Axios.get(`/api/user/upcomings`);
        const response2 = await Axios.get(`/api/user/movies?country=${country}&district=${district}`);
        setUpcomingMovies(response1.data.data);
        setAvailMovies(response2.data.data);
        setDistrict(district);
      } catch (error) {
        if (error && error.response && error.response.data.message === "You are blocked") {
          // Check if toast has already been shown
          if (!toastShown) {
            localStorage.removeItem('userData');
            localStorage.removeItem('userAccessToken');
            dispatch(resetUserState());
            console.log("Your account is blocked");
            toast.error('Your account is blocked');
            setToastShown(true); // Update toastShown to true
            navigate("/login");
          }
        }
      }
    };

    fetchUserData();
  }, [navigate, dispatch, toastShown]);



  const handleGenreChange = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleReleaseDateChange = (date) => {
    setSelectedReleaseDate(date);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterMovies = (movie) => {
    if (selectedGenres.length > 0 && !selectedGenres.some(g => movie.genre.includes(g))) {
      return false;
    }
    // if (selectedReleaseDate && movie.date !== selectedReleaseDate) {
    //   return false;
    // }
    if (searchQuery && !movie.moviename.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  };

  const isMovieNewRelease = (releaseDate) => {
    const currentDate = new Date();
    const movieReleaseDate = new Date(releaseDate);
    const timeDifference = currentDate.getTime() - movieReleaseDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
    const newReleaseThreshold = 1; // Threshold for considering a movie as a new release (e.g., within the last 7 days)
    return daysDifference <= newReleaseThreshold;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-1/5 px-4 py-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Genres</h3>
          {["Action", "Comedy", "Drama", "Thriller"].map(genre => (
            <label key={genre} className="block mb-2">
              <input
                type="checkbox"
                value={genre}
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="mr-2"
              />
              {genre}
            </label>
          ))}
        </div>
        {/* <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Release Date</h3>
          <input
            type="date"
            value={selectedReleaseDate}
            onChange={(e) => handleReleaseDateChange(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div> */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Search</h3>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search movies"
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </aside>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          <div className="px-4 py-5 bg-white shadow sm:rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">Available Shows</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {availMovies.filter(filterMovies).map(movie => (
                <div key={movie._id} className="overflow-hidden shadow-lg rounded-lg">
                  <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="w-full h-auto" />
                  <div className="p-4">
                    <h3 className="text-gray-800 font-semibold text-lg">{movie.moviename}</h3>
                    <div className="flex space-x-4 mb-2">
                      <div className="flex justify-between items-center mt-2">
                        <NavLink to={`/available?movieId=${movie._id}`} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Book Ticket</NavLink>
                        {isMovieNewRelease(movie.releaseDate) && <p className="text-green-500 ml-2">New Release</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-5 mt-6 bg-white shadow sm:rounded-lg">
            <h2 className="text-xl font-semibold text-center mb-4">Upcoming Movies</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {upcomingMovies.map(movie => (
                <NavLink to={`/upcoming?upcomingId=${movie._id}`} key={movie._id} className="overflow-hidden shadow-lg rounded-lg">
                  <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="w-full h-auto" />
                  <div className="p-4">
                    <h3 className="text-gray-800 font-semibold text-lg">{movie.moviename}</h3>
                    <p className="text-gray-600 mt-2">Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
