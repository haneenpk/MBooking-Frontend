import React, { useState } from 'react';
import Axios from "../../api/shared/instance";
import { toast } from 'sonner'
import { addUpcomingSchema } from "../../validations/adminValidations/addUpcoming";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate } from 'react-router-dom';
import { Button } from "@material-tailwind/react";

const AddMovieForm = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    moviename: '',
    image: '',
    languages: '',
    genre: '',
    description: '',
    releaseDate: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");

  const handleChange = (e) => {
    handleInputChange(e, movieData, setMovieData, setServerResponse, setErrors);
  };

  const handleImageUpload = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setMovieData(prevState => ({
        ...prevState,
        image: file
      }));
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null); // Clear preview if invalid file
      }
    }
  };

  const handleSubmit = async () => {
    const trimmedFormData = Object.fromEntries(
      Object.entries(movieData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    try {
      await addUpcomingSchema.validate(trimmedFormData, { abortEarly: false });

      const formData = new FormData();
      formData.append('moviename', movieData.moviename);
      formData.append('image', movieData.image);
      formData.append('languages', movieData.languages);
      formData.append('genre', movieData.genre);
      formData.append('description', movieData.description);
      formData.append('releaseDate', movieData.releaseDate);

      const response = await Axios.post(`/api/admin/upcoming/add`, formData);
      console.log(response);
      toast.success('Added successful');
      navigate('/admin/upcoming');
    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add Upcoming Movie</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="moviename" className="block text-sm font-medium text-gray-600">Movie Name</label>
          <input
            type="text"
            id="moviename"
            name="moviename"
            value={movieData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
            placeholder="Movie Name"
          />
          {errors.moviename && <FormErrorDisplay error={errors.moviename} />}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-600">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleImageUpload}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          />
          {errors.image && <FormErrorDisplay error={errors.image} />}
          {previewImage && (
            <img src={previewImage} alt="Movie Preview" className="h-56 mt-2 rounded-md" />
          )}
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
              placeholder="Languages"
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
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              required
              placeholder="Genres"
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
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
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
            value={movieData.releaseDate}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          />
          {errors.releaseDate && <FormErrorDisplay error={errors.releaseDate} />}
        </div>
        {serverResponse && (
          <div className="mt-2 p-2 text-center font-bold text-red-600" role="alert">
            {serverResponse.message}
          </div>
        )}
        <Button onClick={handleSubmit} fullWidth color='blue'>Add Upcoming Movie</Button>
      </div>
    </div>
  );
};

export default AddMovieForm;
