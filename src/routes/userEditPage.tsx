import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IInputImage, IUserDetails } from "../types";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import IUpdateUserData from "../api/Models/IUpdateUserData";
import {
  updateUser as apiUpdateUser,
  getUserProfile,
  updateUserImage,
} from "../api/UserService";
import {
  selectPicture,
  updateCurrentPicture,
  updatePartialUser,
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import AddressField from "../components/AddressFieldComponent/AddressField";
import { useJsApiLoader } from "@react-google-maps/api";
import { libs } from "../utils/googleMapsUtils";
import { getReadableAddressAsync } from "../utils/locationUtils";

type IUserDetailsParams = {
  userId: string;
};

type Props = {};

const validationSchema = yup.object({
  about: yup.string().max(250, "Must be 250 characters or less"),
  email: yup
    .string()
    .email("Invalid email address")
    .max(50, "Must be 50 characters or less"),
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

  let { userId } = useParams<IUserDetailsParams>();

  const userProfilePicture = useAppSelector(selectPicture);
  const [images, setImages] = useState<string[]>();
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [imageChanged, setImageChanged] = useState<boolean>();

  const getUserDetails = async () => {
    setImageChanged(false);
    try {
      const userProfile = await getUserProfile(userId as string);

      const userDetails: IUserDetails = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        userId: userProfile.facebookId,
        profileImage: userProfilePicture,
        dateJoined: userProfile.dateJoined,
        longitude: userProfile.longitude,
        latitude: userProfile.latitude,
        about: userProfile.about,
        email: userProfile.email,
      };

      setUserDetails(userDetails);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  const formik = useFormik({
    initialValues: {
      about: userDetails.about,
      email: userDetails.email,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: () => { },
  });

  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate(`/users/${userId}`, {
      state: {
        snackBarState: false,
        snackBarMessage: "",
      },
    });
    window.location.reload();
  };

  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = async () => {
    await formik.validateForm();
    if (formik.isValid) {
      const userDetailsEdit = {
        about: formik.values.about,
        email: formik.values.email,
        latitude: userDetails.latitude,
        longitude: userDetails.longitude,
      } as IUpdateUserData;
      try {
        const response = apiUpdateUser(userDetailsEdit);
        console.log("User created successfully!", response);
      } catch (error) {
        console.error("Failed to update user:", error);
      }

      if (imageChanged && images != undefined) {
        const [imageMetaData, imageBase64Data] = images[0].split(",");
        const newUserPicture = {
          base64ImageMetaData: imageMetaData,
          base64ImageData: imageBase64Data,
        };
        updateUserImage(newUserPicture);
        dispatch(
          updateCurrentPicture({
            picture: images[0],
          })
        );
      }

      navigate(`/Users/${userId}`, {
        state: {
          snackBarState: false,
          snackBarMessage: "",
        },
      });
    }
  };

  const handleUploadButtonClick = () => {
    console.log("Browse was clicked");
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

  const [userAddressString, setUserAddressString] = useState<string>("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    let place;

    try {
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

    if (place && place.geometry && place.geometry.location) {
      const newAddress = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      setUserDetails((prevState) => {
        return {
          ...prevState,
          latitude: newAddress.latitude,
          longitude: newAddress.longitude,
        };
      });
    } else {
      console.error("Invalid place object:", place);
    }
  };

  useEffect(() => {
    const getItemAddress = async () => {
      if (
        userDetails &&
        userDetails.latitude != 0 &&
        userDetails.longitude != 0
      ) {
        const a = await getReadableAddressAsync({
          latitude: userDetails.latitude,
          longitude: userDetails.longitude,
        });
        setUserAddressString(a);
      }
    };
    getItemAddress();
  }, [userDetails.latitude != 0]);

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
    </Container>
  );
};

export default UserEditPage;
