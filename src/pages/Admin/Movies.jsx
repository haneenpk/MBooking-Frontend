import React, { useLayoutEffect, useRef, useState } from 'react';
import Axios from "../../api/shared/instance";
import { toast } from 'sonner';
import { addMovieSchema } from "../../validations/adminValidations/addMovie";
import { editMovieSchema } from "../../validations/adminValidations/editMovie";
import handleInputChange from "../../utils/formUtils/handleInputChange";
import handleFormErrors from "../../utils/formUtils/handleFormErrors";
import FormErrorDisplay from "../../components/Common/FormErrorDisplay";
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  Radio,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";

const Movies = () => {

  const fileInputRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(true); // State to track loading status
  const [open, setOpen] = useState(false);
  const [openDel, setDelOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // State to track the selected movie for deletion
  const [modalHead, setModalHead] = useState("");
  const [movieData, setMovieData] = useState({
    moviename: '',
    image: '',
    languages: '',
    genre: '',
    cast: '',
    description: '',
    duration: '',
    type: '2D',
    releaseDate: null,
  });

  const [errors, setErrors] = useState({});
  const [serverResponse, setServerResponse] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    handleInputChange(e, movieData, setMovieData, setServerResponse, setErrors);
  };

  const handleOpen = () => {
    setModalHead("Add");
    setOpen((cur) => !cur);
  };

  const handleDelOpen = (movie) => {
    setSelectedMovie(movie);
    setDelOpen(!openDel);
  };

  const handleCloseOpen = () => {
    setOpen((cur) => !cur);
    setMovieData({
      moviename: '',
      image: '',
      languages: '',
      genre: '',
      cast: '',
      description: '',
      duration: '',
      type: '2D',
      releaseDate: null,
    });
    setPreviewImage(null);
    setErrors({});
    setServerResponse("");
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

  const handleImageChange = async (event) => {
    try {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);
      const response = await Axios.patch(`/api/admin/movie/edit/image/${movieData._id}`, formData);
      fetchMovieData();
      setPreviewImage(`${import.meta.env.VITE_AXIOS_BASE_URL}/${response.data.data.image}`);
      toast.success('Update Image successful');
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const handleAddSubmit = async () => {
    const trimmedFormData = Object.fromEntries(
      Object.entries(movieData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );
    try {
      await addMovieSchema.validate(trimmedFormData, { abortEarly: false });

      const formData = new FormData();
      formData.append('moviename', movieData.moviename);
      formData.append('image', movieData.image);
      formData.append('languages', movieData.languages);
      formData.append('genre', movieData.genre);
      formData.append('cast', movieData.cast);
      formData.append('description', movieData.description);
      formData.append('duration', movieData.duration);
      formData.append('type', movieData.type);
      formData.append('releaseDate', movieData.releaseDate);

      const response = await Axios.post(`/api/admin/movie/add`, formData);
      console.log(response);
      handleCloseOpen();
      fetchMovieData();
      toast.success('Added successful');
    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  const fetchMovieData = async () => {
    try {
      const response = await Axios.get(`/api/admin/movies`);
      console.log(response);
      setMovies(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Handle error
    }
  };

  useLayoutEffect(() => {
    fetchMovieData();
  }, []);

  const handleDelete = async (movieId) => {
    try {
      console.log("Delete movie:", movieId);
      const response = await Axios.delete(`/api/admin/movie/delete/${movieId}`);
      console.log(response);
      fetchMovieData();
      setDelOpen(false); // Close the deletion dialog after deleting the movie
      toast.success('Deleted successful');
    } catch (error) {
      console.log(error);
      // Handle error
    }
    // Add logic to handle deleting the movie at the specified index
  };

  const handleOpenEdit = async (movieId) => {
    try {
      setModalHead("Edit")
      setOpen((cur) => !cur);
      const responseScreen = await Axios.get(`/api/admin/movie/get/${movieId}`);
      let movie = responseScreen.data.data
      movie.languages = movie.languages.join(',')
      movie.genre = movie.genre.join(',')
      movie.cast = movie.cast.join(',')
      setPreviewImage(`${import.meta.env.VITE_AXIOS_BASE_URL}/${movie.image}`);
      delete movie.image
      setMovieData(movie);
      setLoading(false);
    } catch (error) {
      setErrors(error);
      setLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    try {

      await editMovieSchema.validate(movieData, { abortEarly: false });
      await Axios.put(`/api/admin/movie/edit/${movieData._id}`, movieData);
      toast.success('Update successful');
      handleCloseOpen()
      fetchMovieData();
    } catch (error) {
      handleFormErrors(error, setErrors, setServerResponse);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-1">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Movies</h2>
          <Button color="blue" onClick={handleOpen}>Add Movie</Button>
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cast</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie, index) => (
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
                    {movie.cast.map((language, index) => (
                      <div key={index}>{language}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{movie.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{movie.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(movie.releaseDate).toLocaleDateString('en-GB')}
                  </td>
                  <td className=" py-4 whitespace-nowrap">
                    <Button variant="text" onClick={() => handleOpenEdit(movie._id)} color='blue'>Edit</Button>
                    <Button className='-ml-3' onClick={() => handleDelOpen(movie)} variant="text" color='red'>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={openDel} size='sm' handler={() => handleDelOpen(null)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete the movie "{selectedMovie?.moviename}"?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleDelOpen(null)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={() => handleDelete(selectedMovie?._id)} // Ensure correct movie ID is passed
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        size="md"
        open={open}
        handler={handleCloseOpen}
        className="bg-transparent shadow-none max-h-screen overflow-y-auto"
      >
        <Card className="mx-auto w-full max-w-[40rem] ">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" className='text-center' color="blue-gray">
              {modalHead} Movie
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography className='mb-1' variant="h6">
                  Movie Name
                </Typography>
                <Input
                  label="Movie name"
                  size="lg"
                  name="moviename"
                  value={movieData.moviename}
                  onChange={handleChange}
                  autoFocus={false}
                />
                {errors.moviename && <FormErrorDisplay error={errors.moviename} />}
              </div>
              <div>
                <Typography className='mb-1' variant="h6">
                  Release Date
                </Typography>
                <Input
                  type='date'
                  label="Date"
                  size="lg"
                  name="releaseDate"
                  value={movieData.releaseDate ? movieData.releaseDate.substring(0, 10) : ""}
                  onChange={handleChange}
                />
                {errors.releaseDate && <FormErrorDisplay error={errors.releaseDate} />}
              </div>
              <div>
                <Typography className='mb-1' variant="h6">
                  Languages
                </Typography>
                <Input
                  label="Languages separated by comma"
                  size="lg"
                  name="languages"
                  value={movieData.languages}
                  onChange={handleChange}
                />
                {errors.languages && <FormErrorDisplay error={errors.languages} />}
              </div>
              <div>
                <Typography className='mb-1' variant="h6">
                  Genres
                </Typography>
                <Input
                  label="Genres separated by comma"
                  size="lg"
                  name="genre"
                  value={movieData.genre}
                  onChange={handleChange}
                />
                {errors.genre && <FormErrorDisplay error={errors.genre} />}
              </div>
              <div>
                <Typography className='mb-1' variant="h6">
                  Cast
                </Typography>
                <Input
                  label="Cast separated by comma"
                  size="lg"
                  name="cast"
                  value={movieData.cast}
                  onChange={handleChange}
                />
                {errors.cast && <FormErrorDisplay error={errors.cast} />}
              </div>
              <div>
                <Typography className='mb-1' variant="h6">
                  Duration
                </Typography>
                <Input
                  label="Duration of the movie (HH:MM:SS)"
                  size="lg"
                  name="duration"
                  value={movieData.duration}
                  onChange={handleChange}
                />
                {errors.duration && <FormErrorDisplay error={errors.duration} />}
              </div>
            </div>
            <Typography className="-mb-3" variant="h6">
              Description
            </Typography>
            <Input
              label="Short description of the movie"
              size="lg"
              name="description"
              value={movieData.description}
              onChange={handleChange}
            />
            <div className='-mt-4'>
              {errors.description && <FormErrorDisplay error={errors.description} />}
            </div>

            {modalHead === "Add" && (
              <>
                <Typography className="-mb-3" variant="h6">
                  Movie Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                  size="lg"
                />
                <div className='-mt-4'>
                  {errors.image && <FormErrorDisplay error={errors.image} />}
                </div>
                {previewImage && (
                  <img src={previewImage} alt="Movie Preview" className="h-56 w-fit rounded-md" />
                )}
              </>
            )}
            <Typography className="-mb-3" variant="h6">
              Type
            </Typography>
            <div className="items-center gap-10">
              <Radio name="type" label="2D" value="2D" onChange={handleChange} checked={movieData.type === '2D'} />
              <Radio name="type" label="3D" value="3D" onChange={handleChange} checked={movieData.type === '3D'} />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            {serverResponse && (
              <div className="mt-2 p-2 text-center font-bold text-red-600" role="alert">
                {serverResponse.message}
              </div>
            )}
            <Button
              variant="gradient"
              onClick={modalHead === "Add" ? handleAddSubmit : handleEditSubmit}
              fullWidth
            >
              {modalHead}
            </Button>
            {modalHead === "Edit" && (
              <>
                <Typography className="my-2" variant="h6">
                  Movie Image
                </Typography>
                {previewImage && (
                  <img src={previewImage} alt="Movie Preview" className="h-56 w-fit rounded-md" />
                )}
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
              </>
            )}
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default Movies;
