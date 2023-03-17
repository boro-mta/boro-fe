import React, { useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { Container } from "@mui/system";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";

type Props = {};

interface FormValues {
  title: string;
  description: string;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  description: yup
    .string()
    .max(250, "Must be 250 characters or less")
    .required("Required"),
});

const addItemPage = (props: Props) => {
  const [images, setImages] = useState<string[]>();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (
      values: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>
    ) => {
      setTimeout(() => {
        alert(JSON.stringify({ values, images }, null, 2));
        setSubmitting(false);
      }, 2000);
    },
  });

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const convertToBase64 = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    let filesPromises: Promise<string>[] = [];
    debugger;
    if (evt.target.files && evt.target.files.length) {
      Array.from(evt.target.files).forEach((file) =>
        filesPromises.push(toBase64(file))
      );
      const filesInBase64 = await Promise.all(filesPromises);
      setImages(filesInBase64);
    }
  };

  return (
    <Container>
      <Typography variant="h3">Add New Item</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          required
          id="title"
          name="title"
          label="Title"
          margin="normal"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          required
          id="description"
          name="description"
          label="Description"
          multiline
          margin="normal"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <input
          type="file"
          onChange={convertToBase64}
          multiple
          required
          accept="image/*"
        />
        <Button
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Submit
        </Button>
        {formik.isSubmitting && <CircularProgress />}
      </form>
    </Container>
  );
};

export default addItemPage;
