import * as Yup from "yup";

export const addUpcomingSchema = Yup.object({
    moviename: Yup.string().required("Movie name is required"),
    image: Yup.string().required("Image path is required"),
    languages: Yup.string().required("Languages are required"),
    genre: Yup.string().required("Genre is required"),
    description: Yup.string().required("Description is required"),
    releaseDate: Yup.date().required("Release date is required"),
});