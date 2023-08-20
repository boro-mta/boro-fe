import React, { useState, useRef, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Container,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Autocomplete,
  Stack,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  useTheme,
} from "@mui/material";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { FormikHelpers, useFormik } from "formik";
import { categoriesOptions, conditionOptions } from "../mocks/items";
import { ICoordinate, IInputImage, IInputItem } from "../types";
import { useNavigate } from "react-router-dom";
import {
  selectCurrentAddress,
  selectUserId,
  updateServerAddress,
} from "../features/UserSlice";
import { addItem } from "../api/ItemService";
import AddressField from "../components/AddressFieldComponent/AddressField";
import useLocalStorage from "../hooks/useLocalStorage";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { useJsApiLoader } from "@react-google-maps/api";
import { getUserLocation } from "../api/UserService";
import { libs } from "../utils/googleMapsUtils";
import { Theme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import { useAppDispatch, useAppSelector } from "../app/hooks";

type Props = {};

import * as yup from "yup";

interface FormValues {
  title: string;
  description: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  name: string,
  selectedCategories: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  const [address, setAddress] = useState<ICoordinate>(
    useAppSelector(selectCurrentAddress) // current location
  );
  const [homeAddress, setHomeAddress] = useState<any>({ lat: 0, lng: 0 });
  const [itemInitialAddress, setItemInitialAddress] = useState<string>("");

  const imagesInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>();
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>("");

  const userId = useAppSelector(selectUserId);

  const [categoryArr, setCategoryArr] = React.useState<any[]>(
    categoriesOptions
  );
  const [conditionArr, setConditionArr] = React.useState<any[]>(
    conditionOptions
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  const [formValuesAddItem, setFormValusAddItem] = React.useState<FormValues>({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  const [myLocation, setMyLocation] = useState<ICoordinate>({
    latitude: 0,
    longitude: 0,
  });

  const formik: any = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (
      values: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>
    ) => {
      setSubmitting(false);
      setFormValusAddItem(values);
      handleNext();
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
    if (evt.target.files && evt.target.files.length) {
      Array.from(evt.target.files).forEach((file) => {
        filesPromises.push(toBase64(file));
      });
      const filesInBase64 = await Promise.all(filesPromises);
      setImages(filesInBase64);

      //imagesNames for showing img preview:
      const newImagesNamesInBase64Format = convertImagesTypeFromString(
        filesInBase64
      );
      const newImagesNamesInStringFormat = formatImagesOnRecieve(
        newImagesNamesInBase64Format
      );

      newImagesNamesInStringFormat.map(function(fileName) {
        setImagesNames((oldArray) => [...oldArray, fileName]);
      });
    }
  };

  const sendRequest = async (obj: any) => {
    let imagesForBody: IInputImage[];
    if (obj.images) {
      imagesForBody = convertImagesTypeFromString(obj.images);
    } else {
      imagesForBody = [];
    }

    const reqBody: IInputItem = {
      title: obj.title,
      description: obj.description,
      condition: obj.condition,
      categories: obj.categories,
      images: imagesForBody,
      latitude: obj.latitude,
      longitude: obj.longitude,
    };

    try {
      const itemId = await addItem(reqBody);
      console.log(itemId);
      setIsAddSuccess(true);
      navigate(`/item/${itemId}`);
    } catch (e) {
      setIsAddSuccess(false);
      console.log(e);
    }
  };

  const convertImagesTypeFromString = (
    imagesArrInString: string[]
  ): IInputImage[] => {
    let imagesForBody: IInputImage[] = imagesArrInString.map((img: string) => {
      const imgProps = img.split(",");
      return {
        base64ImageData: imgProps[1],
        base64ImageMetaData: imgProps[0],
      };
    });

    return imagesForBody;
  };

  const onAddItem = () => {
    const values: FormValues = formValuesAddItem;
    const forRequest: IInputItem = {
      condition: condition,
      categories: selectedCategories,
      title: values.title,
      description: values.description,
      latitude: address.latitude,
      longitude: address.longitude,
    };

    sendRequest({ ...forRequest, images }).then(() => {
      setOpen(true);
      formik.setSubmitting(false);
    });
  };

  const removeImage = (fileName: string) => {
    const index = imagesNames.indexOf(fileName);

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

  // vertical stepper:
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleUploadButtonClick = () => {
    if (imagesInputRef && imagesInputRef.current) {
      imagesInputRef.current.click();
    }
  };

  const handleChangeCategories = (value: any) => {
    setSelectedCategories(value);
  };

  // item location
  const [userInfo, setUser] = useLocalStorage("user", "");
  const dispatch = useAppDispatch();

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
      setAddress(newAddress);
    } else {
      console.error("Invalid place object:", place);
    }
  };

  const handleSaveAddress = () => {
    const userLocalInfo = JSON.parse(userInfo);
    dispatch(updateServerAddress(address));
    setUser(JSON.stringify({ ...userLocalInfo, address }));
  };

  useEffect(() => {
    const onWakeFunction = async () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setMyLocation({
            latitude: 32.08602761576923,
            longitude: 34.774667,
          });
          console.log("Failed to get the user's location");
        }
      );

      if (userId) {
        const serverHomeAddress = await getUserLocation(userId);
        setHomeAddress(serverHomeAddress);
        setAddress(serverHomeAddress);
      }
    };

    onWakeFunction();
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    if (homeAddress.latitude && homeAddress.longitude) {
      geocoder
        .geocode({
          location: { lat: homeAddress.latitude, lng: homeAddress.longitude },
        })
        .then((response) => {
          setItemInitialAddress(response.results[0].formatted_address);
        });
    }
  }, [homeAddress, isLoaded]);

  return (
    <Container>
      <Typography variant="h3">Add New Item</Typography>
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* step 1 */}
          <Step key={"Fill Item Information"}>
            <StepLabel>{"Fill Item Information"}</StepLabel>
            <StepContent>
              <Box>
                <Typography component={"span"}>
                  <fieldset
                    disabled={formik.isSubmitting}
                    style={{ border: 0 }}
                  >
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
                        error={
                          formik.touched.title && Boolean(formik.errors.title)
                        }
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
                          formik.touched.description &&
                          Boolean(formik.errors.description)
                        }
                        helperText={
                          formik.touched.description &&
                          formik.errors.description
                        }
                      />

                      {homeAddress.lat != 0 && homeAddress.lng != 0 && (
                        <AddressField
                          onLoad={onLoad}
                          handlePlaceChanged={handlePlaceChanged}
                          savedAddress={itemInitialAddress}
                        />
                      )}

                      <Autocomplete
                        id="condition"
                        options={conditionArr}
                        getOptionLabel={(option: any) => option.text}
                        onChange={(event, value) => {
                          setCondition(value.text);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Condition"
                            margin="normal"
                            placeholder="Choose your item condition"
                          />
                        )}
                      />

                      <Stack spacing={3}>
                        <Autocomplete
                          multiple
                          id="tags-outlined"
                          options={categoryArr}
                          getOptionLabel={(option: any) => option}
                          filterSelectedOptions
                          onChange={(event, value) => {
                            handleChangeCategories(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Categories"
                              margin="normal"
                              placeholder="Choose categories for your item"
                            />
                          )}
                        />
                      </Stack>

                      <LoadingButton
                        sx={{ mt: 1, mr: 1 }}
                        type="submit"
                        endIcon={<SendIcon />}
                        loading={formik.isSubmitting}
                        loadingPosition="center"
                        variant="contained"
                      >
                        <span>Continue</span>
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
                      severity={isAddSuccess ? "success" : "error"}
                    >
                      {isAddSuccess
                        ? "The item was added successfully!"
                        : "There was an issue adding the item. please try again."}
                    </Alert>
                  </Snackbar>
                </Typography>

                <Box>
                  <Button
                    disabled={true}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </Box>
            </StepContent>
          </Step>

          {/* step 2 */}
          <Step key={"Add Pictures of Your Item"}>
            <StepLabel>{"Add Pictures of Your Item"}</StepLabel>
            <StepContent>
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
              {imagesNames.length > 0 && (
                <>
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
                        <img className="img-data" src={name} height={"30px"} />
                        <IconButton onClick={() => removeImage(name)}>
                          <DeleteForeverIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              <input
                type="file"
                style={{ display: "none" }}
                ref={imagesInputRef}
                onChange={convertToBase64}
                multiple
                accept="image/*"
                disabled={formik.isSubmitting}
              />
              <Box>
                <div>
                  <Button
                    variant="contained"
                    onClick={onAddItem}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {"Submit"}
                  </Button>
                  <Button
                    disabled={false}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        {activeStep === 2 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            {/* todo: change message */}
            <Typography component={"span"}>
              All steps completed - you&apos;re finished
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default addItemPage;
