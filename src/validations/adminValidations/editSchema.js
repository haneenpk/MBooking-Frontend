import * as Yup from "yup";

export const editSchema = Yup.object({
  name: Yup
    .string()
    .required("Name is required"),
});
