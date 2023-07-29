import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { initialState, selectAccessToken, selectFacebookId, updateUser } from "../features/UserSlice";
import {
  selectEmail,
  selectUserName,
  selectPicture,
  selectUserId
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateUser as apiUpdateUser } from "../api/UserService"
import IUpdateUserData from "../api/Models/IUpdateUserData";

type Props = {};

//A validation schema for the form
const validationSchema = yup.object({
  firstName: yup.string().max(30, "Must be 30 characters or less"),
  lastName: yup.string().max(30, "Must be 30 characters or less"),
  about: yup.string().max(250, "Must be 250 characters or less"),
  email: yup
    .string()
    .email("Invalid email address")
    .max(50, "Must be 50 characters or less"),
});

const NewUserPage = (props: Props) => {

  //Dispatcher for redux
  const dispatch = useAppDispatch();

  //Get all details retreived from the facebook login
  const userEmail = useAppSelector(selectEmail);
  const userFullName = useAppSelector(selectUserName);
  const userProfilePicture = useAppSelector(selectPicture);
  const [firstName, lastName] = userFullName.split(" ");
  const userId = useAppSelector(selectUserId);

  const formik = useFormik({
    initialValues: {
      firstName: firstName,
      lastName: lastName,
      about: "",
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

  //Navigation tool
  const navigate = useNavigate();

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      }
    });
  }


  const facebookid = useAppSelector(selectFacebookId);
  const accessToken = useAppSelector(selectAccessToken);
  //Create a new user on Boro's server
  const handleCreateNewUserClick = async () => {
    const userPictureBase64 = await getBase64FromUrl(userProfilePicture) as string;
    const [imageMetaData, imageBase64Data] = userPictureBase64.split(',');
    const userPictureToUpdate = {
      base64ImageMetaData: imageMetaData,
      base64ImageData: imageBase64Data
    }

    const userDetails = {
      about: formik.values.about,
      email: formik.values.email,
      longitude: 0,
      latitude: 0,
      image: userPictureToUpdate
    } as IUpdateUserData;

    try {
      //Send userDetails to the server and create the new user on Boro's server
      const response = await apiUpdateUser(userDetails);
      console.log("User created successfully!", response);
      //After guid was retrived, update the redux with the new guid
      dispatch(
        updateUser({
          name: firstName + " " + lastName,
          userId: userId,
          picture: userProfilePicture,
          email: formik.values.email,
          facebookId: facebookid,
          accessToken: accessToken,
          serverAddress: {
            latitude: 0,
            longitude: 0
          },
          currentAddress: {
            latitude: 0,
            longitude: 0
          }
        })
      );

      //Navigate to the created user's page
      navigate("/Users/" + userId);
      window.location.reload();
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
          required={true}
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