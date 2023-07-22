import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { initialState, updateServerAddress, updateUser } from "../features/UserSlice";
import {
  selectEmail,
  selectUserName,
  selectPicture,
  selectUserId
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateUser as apiUpdateUser } from "../api/UserService"
import IUpdateUserData from "../api/Models/IUpdateUserData";
import useLocalStorage from "../hooks/useLocalStorage";
import AddressField from "../components/AddressFieldComponent/AddressField";

type Props = {};
type address = {
  longitude: number,
  latitude: number
}

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
  const [userChosenAddress, setUserChosenAddress] = useState<address>(
    {
      longitude: 0,
      latitude: 0
    }
  );

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

  //Create a new user on Boro's server
  const handleCreateNewUserClick = async () => {
    const userDetails = {
      about: formik.values.about,
      email: formik.values.email,
      longitude: userChosenAddress.longitude,
      latitude: userChosenAddress.latitude,
    } as IUpdateUserData;

    try {
      //Send userDetails to the server and create the new user on Boro's server
      const response = await apiUpdateUser(userDetails);
      console.log("User created successfully!", response);

      //Save selected address in redux as serverAddress
      handleSaveAddress();

      //After guid was retrived, update the redux with the new guid
      dispatch(
        updateUser({
          ...initialState,
          name: firstName + " " + lastName,
          userId: userId,
          picture: userProfilePicture,
          email: formik.values.email,
        })
      );

      //Navigate to the new user's page
      navigate("/Users/" + userId);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  // item location
  const [userInfo, setUser] = useLocalStorage("user", "");
  //const dispatch = useAppDispatch();

  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    let place;

    try {
      // Check if autocompleteRef exists and has the getPlace() method
      if (
        autocompleteRef &&
        autocompleteRef.current &&
        typeof autocompleteRef.current.getPlace === "function"
      ) {
        place = autocompleteRef.current.getPlace();
      }
    } catch (error) {
      console.error("Error getting place:", error);
      return;
    }

    // Check if place and place.geometry exist and have the location property
    if (place && place.geometry && place.geometry.location) {
      const newAddress = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      setUserChosenAddress(newAddress);
    } else {
      console.error("Invalid place object:", place);
    }
  };

  const handleSaveAddress = () => {
    const userLocalInfo = JSON.parse(userInfo);
    dispatch(updateServerAddress(userChosenAddress));
    setUser(JSON.stringify({ ...userLocalInfo, userChosenAddress }));
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
        <AddressField
          onLoad={onLoad}
          handlePlaceChanged={handlePlaceChanged}
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
