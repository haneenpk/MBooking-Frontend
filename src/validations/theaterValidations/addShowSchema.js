import * as Yup from "yup";

export const addShowSchema = Yup.object({
    screenId: Yup
        .string()
        .required("Select a theater"),
    movieId: Yup
        .string()
        .required("Select a movie"),
    startTime: Yup
        .string()
        .matches(
            /^(1[0-2]|0?[1-9]):[0-5][0-9](AM|PM)$/,
            "Start time must be in hh:mmAM or hh:mmPM format (e.g., 11:00AM)"
        )
        .required("Start time is required"),
    date: Yup
        .date()
        .required("Date is required"),
    diamondPrice: Yup
        .string()
        .required("Diamond price is required"),
    goldPrice: Yup
        .string()
        .required("Gold price is required"),
    silverPrice: Yup
        .string()
        .required("Silver price is required"),
});
