import * as Yup from "yup";

export const otpSchema = Yup.object({
  otp: Yup
    .string()
    .length(4, "OTP must be 4 number")
    .required("OTP is required"),
});
