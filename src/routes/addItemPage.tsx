import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { FormikHelpers, useFormik } from "formik";
import { Container } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import * as yup from "yup";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

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
  const [open, setOpen] = useState<boolean>(false);

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
        setOpen(true);
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
      <fieldset disabled={formik.isSubmitting} style={{ border: 0 }}>
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
            disabled={formik.isSubmitting}
          />
          <LoadingButton
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
            endIcon={<SendIcon />}
            loading={formik.isSubmitting}
            loadingPosition="center"
            variant="contained"
          >
            <span>Submit</span>
          </LoadingButton>
        </form>
      </fieldset>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          The item was added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default addItemPage;
