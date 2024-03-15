import * as Yup from "yup";

export const editSchema = Yup.object({
  username: Yup
    .string()
    .required("Username is required"),
  email: Yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: Yup
    .string()
    .matches(/^\d{10}$/, "Invalid phone number")
    .required("Phone number is required"),
});
