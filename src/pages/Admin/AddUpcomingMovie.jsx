import React, { useState } from 'react';
import Axios from "../../api/shared/instance";
import { addUpcomingSchema } from "../../validations/adminValidations/addUpcoming";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { useNavigate } from 'react-router-dom';

const AddMovieForm = () => {

  const navigate = useNavigate()

  const [movieData, setMovieData] = useState({
    moviename: '',
    image: '',
    languages: '',
    genre: '',
    description: '',
    releaseDate: null,
  });

  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");

  const handleChange = (e) => {
    handleInputChange(e, movieData, setMovieData, setServerResponse, setErrors);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setMovieData(prevState => ({
      ...prevState,
      image: file
    }));
  };

  const handleSubmit = async () => {
    try {

      await addUpcomingSchema.validate(movieData, { abortEarly: false });

      const formData = new FormData();
      formData.append('moviename', movieData.moviename);
      formData.append('image', movieData.image);
      formData.append('languages', movieData.languages);
      formData.append('genre', movieData.genre);
      formData.append('description', movieData.description);
      formData.append('releaseDate', movieData.releaseDate);

      const response = await Axios.post(`/api/admin/upcoming/add`, formData);
      console.log(response);
      navigate('/admin/upcoming')
    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  return (
    <div className="max-w-md mx-auto py-5">
      <h2 className="text-xl font-semibold mb-4 text-center">Add Upcoming Movies</h2>
      <div className="mb-4">
        <label htmlFor="moviename" className="block mb-1">Movie Name</label>
        <input type="text" id="moviename" name="moviename" value={movieData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        {errors.moviename &&
          <FormErrorDisplay error={errors.moviename} />
        }
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-1">Image Upload</label>
        <input type="file" accept="image/*" id="image" name="image" onChange={handleImageUpload} className="w-full border rounded px-3 py-2" required />
        {errors.image &&
          <FormErrorDisplay error={errors.image} />
        }
      </div>
      <div className="mb-4">
        <label htmlFor="languages" className="block mb-1">Languages</label>
        <input type="text" id="languages" name="languages" value={movieData.languages} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        {errors.languages &&
          <FormErrorDisplay error={errors.languages} />
        }
      </div>
      <div className="mb-4">
        <label htmlFor="genre" className="block mb-1">Genre</label>
        <input type="text" id="genre" name="genre" value={movieData.genre} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        {errors.genre &&
          <FormErrorDisplay error={errors.genre} />
        }
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea id="description" name="description" value={movieData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        {errors.description &&
          <FormErrorDisplay error={errors.description} />
        }
      </div>
      <div className="mb-4">
        <label htmlFor="releaseDate" className="block mb-1">Release Date</label>
        <input type="date" id="releaseDate" name="releaseDate" value={movieData.releaseDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
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
      <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Movie</button>

    </div>
  );
};

export default AddMovieForm;
