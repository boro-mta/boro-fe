import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDetails } from "../types";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import api from "../api/HttpClient";
import { initialState, updateUser } from "../features/UserSlice";
import {
  selectEmail,
  selectUserName,
  selectPicture,
  selectGuid
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateUser as apiUpdateUser } from "../api/UserService"
import IUpdateUserData from "../api/Models/IUpdateUserData";

type IUserDetailsParams = {
  userId: string;
};

type Props = {};

const validationSchema = yup.object({
  first_name: yup.string().max(30, "Must be 30 characters or less"),
  last_name: yup.string().max(30, "Must be 30 characters or less"),
  about: yup.string().max(250, "Must be 250 characters or less"),
  email: yup
    .string()
    .email("Invalid email address")
    .max(50, "Must be 50 characters or less"),
});

const NewUserPage = (props: Props) => {
  const dispatch = useAppDispatch();

  const userEmail = useAppSelector(selectEmail);
  const userFullName = useAppSelector(selectUserName);
  const userProfilePicture = useAppSelector(selectPicture);
  const [firstName, lastName] = userFullName.split(" ");
  const userGuid = useAppSelector(selectGuid);

  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      about: "",
      profileImage: " ",
      userId: " ",
      dateJoined: " ",
      longitude: 0,
      latitude: 0,
      email: userEmail,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => { },
  });
  const navigate = useNavigate();

  const handleCreateNewUserClick = async () => {
    const userDetails = {
      about: formik.values.about,
      email: formik.values.email,
      longitude: 0,
      latitude: 0,
    } as IUpdateUserData;

    try {
      const response = await apiUpdateUser(userDetails);
      console.log("User created successfully!", response);

      console.log(userGuid);
      dispatch(
        updateUser({
          ...initialState,
          name: firstName + " " + lastName,
          guid: userGuid,
          picture: userProfilePicture,
          email: formik.values.email,
        })
      );

      navigate("/Users/" + userGuid);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h3">
        Welcome to Boro! Enter your details so other Boros can know who you are{" "}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="about"
          name="about"
          label="About"
          multiline
          margin="normal"
          placeholder="Tell us about yourself"
          value={formik.values.about}
          onChange={formik.handleChange}
          error={formik.touched.about && Boolean(formik.errors.about)}
          helperText={formik.touched.about && formik.errors.about}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          multiline
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={false}
          style={{ marginRight: "8px", padding: "8px 16px" }}
          onClick={handleCreateNewUserClick}
        >
          Save
        </Button>

        {formik.isSubmitting && <CircularProgress />}
      </form>
    </Container>
  );
};

export default NewUserPage;
