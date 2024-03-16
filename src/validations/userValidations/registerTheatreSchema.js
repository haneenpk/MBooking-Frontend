import * as Yup from "yup";

export const registerTheatreSchema = Yup.object({
    name: Yup
        .string()
        .required("name is required"),
    theatreName: Yup
        .string()
        .required("Theatre name is required"),
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
});
