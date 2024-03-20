import * as Yup from "yup";

export const addScreenSchema = Yup.object({
  name: Yup
    .string()
    .required("name of screen is required"),
  rows: Yup
    .string()
    .required("rows number is required"),
  cols: Yup
    .string()
    .required("columns number is required"),
});