import * as Yup from "yup";

export const editUpcomingSchema = Yup.object({
    moviename: Yup.string().required("Movie name is required"),
    languages: Yup.string().required("Languages are required"),
    genre: Yup.string().required("Genre is required"),
    description: Yup.string().required("Description is required"),
    releaseDate: Yup.date().required("Release date is required"),
});