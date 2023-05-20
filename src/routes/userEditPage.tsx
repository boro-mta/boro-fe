import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDetails } from "../types";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import IUpdateUserData from "../api/Models/IUpdateUserData";
import { updateUser as apiUpdateUser, getUserProfile } from "../api/UserService"
import { selectPicture } from "../features/UserSlice";
import { useAppSelector } from "../app/hooks";

type IUserDetailsParams = {
  userId: string;
};

type Props = {};

//A validation schema for the form
const validationSchema = yup.object({
  About: yup.string().max(250, "Must be 250 characters or less"),
  Email: yup.string().email("Invalid email address").max(50, "Must be 50 characters or less"),
  Latitude: yup.string().max(30, "Must be 30 characters or less"),
  Longitude: yup.string().max(30, "Must be 30 characters or less"),
});

const UserEditPage = (props: Props) => {
  const [userDetails, setUserDetails] = useState<IUserDetails>(
    allUserDetails[3]
  );

  //Get the current userId
  let { userId } = useParams<IUserDetailsParams>();

  const userProfilePicture = useAppSelector(selectPicture);

  //A function used to get details of a user from the server
  //Used to set the initial values of the form
  const getUserDetails = async () => {
    try {
      //Get the current details of the user from the server
      const userProfile = await getUserProfile(userId as string);
      //Save the details inside userDetails
      const userDetails: IUserDetails = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        userId: userProfile.facebookId,
        profileImage: userProfilePicture,
        dateJoined: userProfile.dateJoined,
        longitude: 0,
        latitude: 0,
        about: userProfile.about,
        email: userProfile.email
      };
      //Set the current user data to be the user retreived from the server
      setUserDetails(userDetails);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    //Get the user's details to fill the form's initial values
    getUserDetails();
  }, [userId]);

  //The form used in the page
  const formik = useFormik({
    initialValues: {
      about: userDetails.about,
      email: userDetails.email,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => { },
  });

  //Navigation tool
  const navigate = useNavigate();

  //In case of a cancel click, return to the user's page
  const handleCancelClick = () => {
    navigate(`/users/${userId}`);
  };


  const handleEditClick = async () => {
    //Get the user's new details filled in the form
    const userDetails = {
      about: formik.values.about,
      email: formik.values.email,
      latitude: 0,
      longitude: 0,
    } as IUpdateUserData;
    try {
      //Send the new details to the server
      const response = apiUpdateUser(userDetails);
      console.log("User created successfully!", response);
      navigate("/users/" + userId);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h3">Edit your Details</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          margin="normal"
          required={true}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          id="about"
          name="about"
          label="About"
          multiline
          margin="normal"
          value={formik.values.about}
          onChange={formik.handleChange}
          error={formik.touched.about && Boolean(formik.errors.about)}
          helperText={formik.touched.about && formik.errors.about}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={false}
          style={{ marginRight: "8px", padding: "8px 16px" }}
          onClick={handleEditClick}
        >
          Save
        </Button>
        <Button
          variant="contained"
          type="button"
          disabled={false}
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            backgroundColor: "white",
            color: "red",
          }}
          onClick={handleCancelClick}
        >
          Cancel
        </Button>

        {formik.isSubmitting && <CircularProgress />}
      </form>
    </Container>
  );
};

export default UserEditPage;
