import * as Yup from "yup";

export const editTheaterSchema = Yup.object({
    name: Yup.string().required("Theater name is required"),
    mobile: Yup.string()
        .matches(/^\d{10}$/, "Invalid phone number")
        .required("Mobile number is required"),
    address: Yup.object().shape({
        country: Yup.string().required("Theater country is required"),
        state: Yup.string().required("Theater state is required"),
        district: Yup.string().required("Theater district is required"),
        city: Yup.string().required("Theater city is required"),
    })
});