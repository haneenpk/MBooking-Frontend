import * as Yup from "yup";

export const addMovieSchema = Yup.object({
    moviename: Yup.string().required("Movie name is required"),
    image: Yup.string().required("Image path is required"),
    languages: Yup.string().required("Languages are required"),
    genre: Yup.string().required("Genre is required"),
    cast: Yup.string().required("Languages are required"),
    description: Yup.string().required("Description is required"),
    duration: Yup.string()
    .matches(/^\d{2}:\d{2}:\d{2}$/, "Invalid duration format. Use HH:MM:SS format.")
    .required("Duration is required"),
    type: Yup.string().required("Type is required"),
    releaseDate: Yup.date().required("Release date is required"),
});