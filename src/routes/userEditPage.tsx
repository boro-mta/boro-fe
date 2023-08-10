import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IInputImage, IUserDetails } from "../types";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import IUpdateUserData from "../api/Models/IUpdateUserData";
import { updateUser as apiUpdateUser, getUserProfile, updateUserImage } from "../api/UserService"
import { selectPicture, updateCurrentPicture, updatePartialUser } from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Box from "@mui/material/Box";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import AddressField from "../components/AddressFieldComponent/AddressField";
import { useJsApiLoader } from "@react-google-maps/api";
import { libs } from "../utils/googleMapsUtils";

type IUserDetailsParams = {
  userId: string;
};

type Props = {};

//A validation schema for the form
const validationSchema = yup.object({
  about: yup.string().max(250, "Must be 250 characters or less"),
  email: yup.string().email("Invalid email address").max(50, "Must be 50 characters or less"),
  latitude: yup.string().max(30, "Must be 30 characters or less"),
  longitude: yup.string().max(30, "Must be 30 characters or less"),
});

const UserEditPage = (props: Props) => {
  const [userDetails, setUserDetails] = useState<IUserDetails>({
    userId: "",
    profileImage: "",
    firstName: "",
    lastName: "",
    about: "",
    dateJoined: "",
    email: "",
    latitude: 0,
    longitude: 0,
  });
  const dispatch = useAppDispatch();

  //Get the current userId
  let { userId } = useParams<IUserDetailsParams>();

  const userProfilePicture = useAppSelector(selectPicture);
  const [images, setImages] = useState<string[]>();
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [imageChanged, setImageChanged] = useState<boolean>();

  //A function used to get details of a user from the server
  //Used to set the initial values of the form
  const getUserDetails = async () => {
    setImageChanged(false);
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
        longitude: userProfile.longitude,
        latitude: userProfile.latitude,
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
    window.location.reload();
  };

  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = async () => {

    await formik.validateForm();
    if (formik.isValid) {
      //Get the user's new details filled in the form
      const userDetailsEdit = {
        about: formik.values.about,
        email: formik.values.email,
        latitude: userDetails.latitude,
        longitude: userDetails.longitude,
      } as IUpdateUserData;
      try {
        //Send the new details to the server
        const response = apiUpdateUser(userDetailsEdit);
        console.log("User created successfully!", response);
      } catch (error) {
        console.error("Failed to update user:", error);
      }

      if (imageChanged && images != undefined) {
        const [imageMetaData, imageBase64Data] = images[0].split(',');
        const newUserPicture = {
          base64ImageMetaData: imageMetaData,
          base64ImageData: imageBase64Data
        }
        updateUserImage(newUserPicture);
        dispatch(updateCurrentPicture({
          picture: images[0]
        }))
      }

      navigate(`/Users/${userId}`);
      window.location.reload();
    }
  };

  const handleUploadButtonClick = () => {

    console.log('Browse was clicked');
    if (imagesInputRef && imagesInputRef.current) {
      imagesInputRef.current.click();
    }
    setImageChanged(true);
  };

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
    let currImagesNames: string[] = [];
    if (evt.target.files && evt.target.files.length) {
      Array.from(evt.target.files).forEach((file) => {
        filesPromises.push(toBase64(file));
        currImagesNames.push(file.name);
      });
      const filesInBase64 = await Promise.all(filesPromises);
      setImages(filesInBase64);
      setImagesNames(currImagesNames);
    }
  };

  const removeImage = (fileName: string) => {
    const index = imagesNames.indexOf(fileName);
    setImageChanged(false);
    if (index !== -1) {
      const newImageNames = [...imagesNames];
      newImageNames.splice(index, 1);
      setImagesNames(newImageNames);

      if (images) {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
      }
    }
  };

  // user location
  const [userAddressString, setUserAddressString] = useState<string>("");

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
      setUserDetails(prevState => {
        return {
          ...prevState,
          latitude: newAddress.latitude,
          longitude: newAddress.longitude,
        }
      })
    } else {
      console.error("Invalid place object:", place);
    }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    if (userDetails.latitude != 0 && userDetails.longitude != 0) {
      geocoder.geocode({ location: { lat: userDetails.latitude, lng: userDetails.longitude } })
        .then((response) => {
          setUserAddressString(response.results[0].formatted_address);
        })
    }
  }, [userDetails.latitude != 0, isLoaded]);

  return (
    <Container>
      <Typography variant="h3">Edit Your Details</Typography>
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

        {formik.isSubmitting && <CircularProgress />}
      </form>

      {userDetails.latitude != 0 && userDetails.longitude != 0 && (
        <AddressField
          onLoad={onLoad}
          handlePlaceChanged={handlePlaceChanged}
          savedAddress={userAddressString}
        />
      )}

      <Typography variant="h3">Edit Your Profile Picture</Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box
          onClick={handleUploadButtonClick}
          sx={{
            height: "125px",
            border: "1px dashed grey",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FileUploadOutlinedIcon fontSize="large" />
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", width: "40%" }}
          >
            Browse
          </Button>
        </Box>
        <input
          type="file"
          style={{ display: "none" }}
          ref={imagesInputRef}
          onChange={convertToBase64}
          accept="image/*"
          disabled={formik.isSubmitting}
        />
        {formik.isSubmitting && <CircularProgress />}
      </form>

      <Typography
        component={"span"}
        variant="h6"
        sx={{ fontWeight: "bold", marginTop: "10px" }}
      >
        Uploaded images
      </Typography>
      <List>
        {imagesNames.map((name, index) => (
          <ListItem
            key={index}
            sx={{ paddingTop: "1px", paddingBottom: "1px" }}
          >
            <ListItemIcon>
              <ImageIcon sx={{ marginRight: "16px" }} />
            </ListItemIcon>
            <ListItemText primary={name} />
            <IconButton onClick={() => removeImage(name)}>
              <DeleteForeverIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

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
    </Container >

  );
};

export default UserEditPage;