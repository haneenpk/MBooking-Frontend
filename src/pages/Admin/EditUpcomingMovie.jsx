import React, { useLayoutEffect, useState, useRef } from 'react';
import { Button } from "@material-tailwind/react";
import Axios from "../../api/shared/instance";
import { toast } from 'sonner';
import { editUpcomingSchema } from "../../validations/adminValidations/editUpcoming";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const EditUpcomingMovie = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const upcomingId = queryParams.get("upcomingId");

  const [movieData, setMovieData] = useState({});
  const [upcomingImage, setUpcomingImage] = useState("");
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");
  const [isLoading, setLoading] = useState(true); // State to track loading status
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    handleInputChange(e, movieData, setMovieData, setServerResponse, setErrors);
  };

  const handleUpdate = async () => {
    try {
      await editUpcomingSchema.validate(movieData, { abortEarly: false });
      const response = await Axios.put(`/api/admin/upcoming/edit/${upcomingId}`, movieData);
      toast.success('Update successful');
      navigate('/admin/upcoming');
    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  const handleImageChange = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const response = await Axios.patch(`/api/admin/upcoming/edit/image/${upcomingId}`, formData);
      fetchUpcomingMovieData();
      toast.success('Update Image successful');
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const fetchUpcomingMovieData = async () => {
    try {
      const responseScreen = await Axios.get(`/api/admin/upcoming/get/${upcomingId}`);
      let upcoming = responseScreen.data.data;
      upcoming.languages = upcoming.languages.join(',');
      upcoming.genre = upcoming.genre.join(',');
      setUpcomingImage(upcoming.image);
      delete upcoming.image;
      setMovieData(upcoming);
      setLoading(false);
    } catch (error) {
      setErrors(error);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchUpcomingMovieData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-xl font-semibold mb-6 text-center">Edit Upcoming Movie</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="moviename" className="block text-sm font-medium text-gray-600">Movie Name</label>
          <input
            type="text"
            id="moviename"
            name="moviename"
            value={movieData.moviename}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
            required
            placeholder="Movie Name"
          />
          {errors.moviename && <FormErrorDisplay error={errors.moviename} />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-600">Languages</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={movieData.languages}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              required
              placeholder="Languages (separated by comma)"
            />
            {errors.languages && <FormErrorDisplay error={errors.languages} />}
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-600">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
              required
              placeholder="Genre (separated by comma)"
            />
            {errors.genre && <FormErrorDisplay error={errors.genre} />}
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            id="description"
            name="description"
            value={movieData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
            required
            placeholder="Short description of the movie"
          />
          {errors.description && <FormErrorDisplay error={errors.description} />}
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-600">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={movieData.releaseDate ? movieData.releaseDate.substring(0, 10) : ""}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200"
            required
          />
          {errors.releaseDate && <FormErrorDisplay error={errors.releaseDate} />}
        </div>
        {serverResponse && (
          <div className="mt-2 p-2 text-center font-bold text-red-600" role="alert">
            {serverResponse.message}
          </div>
        )}
        <Button onClick={handleUpdate} fullWidth color='blue'>Edit Upcoming Movie</Button>
        <div className="mt-3">
          <h1 className="text-xl font-semibold mb-4">Image</h1>
          <img src={`${import.meta.env.VITE_AXIOS_BASE_URL}/${upcomingImage}`} alt={movieData.moviename} className="h-72 w-64 object-cover rounded-lg" />
          <div className="relative mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <Button onClick={() => fileInputRef.current.click()}>Update Image</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUpcomingMovie;
