import React, { useLayoutEffect, useState } from 'react';
import Axios from "../../api/shared/instance";
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const UpcomingMovies = () => {

  const [upcomings, setUpcomings] = useState([]);
  const [isLoading, setLoading] = useState(true); // State to track loading status

  const fetchTheaterData = async () => {
    try {
      const response = await Axios.get(`/api/admin/upcomings`);
      console.log(response);
      setUpcomings(response.data.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
      // Handle error
    }
  };

  useLayoutEffect(() => {
    fetchTheaterData();
  }, []);

  const handleDelete = async (upcomingId) => {
    try {
      console.log("Delete movie:", upcomingId);
      const response = await Axios.delete(`/api/admin/upcoming/delete/${upcomingId}`);
      console.log(response);
      fetchTheaterData();
    } catch (error) {
      console.log(error);
      // Handle error
    }
    // Add logic to handle deleting the movie at the specified index
    
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-1">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Upcoming Movies</h2>
          <NavLink to="/admin/upcoming/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Add Upcoming Movie
          </NavLink>
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomings.map((movie, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{movie.moviename}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`} alt={movie.moviename} className="h-20 w-16 object-cover rounded-sm" /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.languages.map((language, index) => (
                      <div key={index}>{language}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {movie.genre.map((genre, index) => (
                      <div key={index}>{genre}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(movie.releaseDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NavLink to={`/admin/upcoming/edit?upcomingId=${movie._id}`} className="text-blue-500 hover:text-blue-700 hover:underline mr-3">
                      Edit
                    </NavLink>
                    <button onClick={() => handleDelete(movie._id)} className="text-red-500 hover:text-red-700 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMovies;
