import * as Yup from "yup";

export const registerTheaterSchema = Yup.object({
    name: Yup
        .string()
        .required("name is required"),
    email: Yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    mobile: Yup
        .string()
        .matches(/^\d{10}$/, "Invalid phone number")
        .required("Mobile number is required"),
    password: Yup
        .string()
        .min(8, "Password must be at least 8 characters")
        // .matches(
        //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        //   "Password must contain at least one lowercase letter, one uppercase letter, and one special character"
        // )
        .required("Password is required"),
    confirmPassword: Yup
        .string()
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    country: Yup
        .string()
        .required("Theatre country is required"),
    state: Yup
        .string()
        .required("Theatre state is required"),
    district: Yup
        .string()
        .required("Theatre district is required"),
    city: Yup
        .string()
        .required("Theatre city is required"),
});
