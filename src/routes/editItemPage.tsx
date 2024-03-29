import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  Autocomplete,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Snackbar,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import { ICoordinate, IFullImageDetails, IInputItem } from "../types";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { categoriesOptions, conditionOptions } from "../mocks/items";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IInputImage } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import IUpdateItemInfoInput from "../api/Models/IUpdateItemInfoInput";
import { deleteItem, getItem } from "../api/ItemService";
import {
  updateItemInfo,
  addItemImage,
  updateItemLocation,
} from "../api/UpdateItemsService";
import AddressField from "../components/AddressFieldComponent/AddressField";
import { IItemResponse } from "../api/Models/IItemResponse";
import { useJsApiLoader } from "@react-google-maps/api";
import { libs } from "../utils/googleMapsUtils";
import { getReadableAddressAsync } from "../utils/locationUtils";
import DeleteIcon from '@mui/icons-material/Delete';

type IFullItemDetailsParams = {
  itemId: string;
};

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

const EditItemPage = (props: Props) => {
  const imagesInputRef = useRef<HTMLInputElement | null>(null);
  const [imagesFromServer, setImagesFromServer] = useState<IFullImageDetails[]>(
    []
  );
  const [images, setImages] = useState<IInputImage[]>([]);
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [serverImagesNames, setServerImagesNames] = useState<string[]>([]);
  const [imagesIDToRemove, setImagesIDToRemove] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>("");

  const [categoryArr, setCategoryArr] = React.useState<any[]>(
    categoriesOptions
  );
  const [conditionArr, setConditionArr] = React.useState<any[]>(
    conditionOptions
  );
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [itemDetails, setItemDetails] = useState<IItemResponse>({
    categories: [],
    condition: "",
    id: "",
    title: "",
    images: [],
    description: "",
    longitude: 0,
    latitude: 0,
    ownerId: null,
  });

  const [serverRequestError, setServerRequestError] = useState<any>();
  let itemServerDetails: IItemResponse;

  const [formValuesEditItem, setFormValusEditItem] = React.useState<FormValues>(
    {
      title: itemDetails.title,
      description: itemDetails.description,
    }
  );

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleUploadButtonClick = () => {
    if (imagesInputRef && imagesInputRef.current) {
      imagesInputRef.current.click();
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadNewImages = async (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    let filesPromises: Promise<string>[] = [];

    if (evt.target.files && evt.target.files.length) {
      Array.from(evt.target.files).forEach((file) => {
        filesPromises.push(toBase64(file));
      });

      const filesInBase64: string[] = await Promise.all(filesPromises);

      //imagesNames for showing img preview:
      const newImagesNamesInBase64Format = convertImagesTypeFromString(
        filesInBase64
      );
      const newImagesNamesInStringFormat = formatImagesOnRecieve(
        newImagesNamesInBase64Format
      );

      newImagesNamesInStringFormat.map(function (fileName) {
        setImagesNames((oldArray) => [...oldArray, fileName]);
      });

      //images for server update:
      let newImagesInStringormat: string[] = [];

      filesInBase64.map(function (file) {
        newImagesInStringormat.push(file);
      });

      const newImagesInBase64Format = convertImagesTypeFromString(
        newImagesInStringormat
      );
      setImages(newImagesInBase64Format);
    }
  };

  const sendEditRequest = async (obj: any) => {
    try {
      const updateItemInput: IUpdateItemInfoInput = {
        title: obj.title,
        description: obj.description,
        condition: obj.condition,
        categories: obj.categories,
        imagesToRemove: imagesIDToRemove,
      };

      console.log(updateItemInput);
      await updateItemInfo(itemId, updateItemInput);
      for (const image of images) {
        const imageId = await addItemImage(itemId, image);
      }

      console.log(obj.latitude, obj.longitude);
      const responseLocation = await updateItemLocation(
        itemId,
        obj.latitude,
        obj.longitude
      );
      console.log(responseLocation);
      setIsAddSuccess(true);
      navigate(`/item/${itemId}`);
    } catch (e) {
      setIsAddSuccess(false);
      console.log("error in updating item");
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

  const onEditItem = () => {
    const forRequest: IInputItem = {
      condition,
      categories: selectedCategories,
      title: formik.values.title,
      description: formik.values.description,
      latitude: address.latitude,
      longitude: address.longitude,
    };
    sendEditRequest({ ...forRequest, images }).then(() => {
      setOpen(true);
      formik.setSubmitting(false);
    });
  };

  const removeImage = (fileName: string) => {
    const index = serverImagesNames.indexOf(fileName);
    const indexForImagesNames = imagesNames.indexOf(fileName);

    if (index !== -1) {
      const newImageNames = [...imagesNames];
      newImageNames.splice(indexForImagesNames, 1);
      setImagesNames(newImageNames);

      if (imagesFromServer[index]) {
        const newImgIDToRemove: string = imagesFromServer[index].imageId;
        setImagesIDToRemove([...imagesIDToRemove, newImgIDToRemove]);
      }
    }
  };

  const [address, setAddress] = useState<ICoordinate>({
    latitude: 0,
    longitude: 0,
  });

  // item location
  const [itemAddress, setItemAddress] = useState<string>("");

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

  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate(`/item/${itemId}`);
  };

  const handleSaveClick = () => {
    onEditItem();
  };

  const [openDeleteItemDialog, setOpenDeleteItemDialog] = React.useState(false);

  const handleClickOpenDeleteItemDialog = () => {
    setOpenDeleteItemDialog(true);
  };

  const handleCloseDeleteItemDialog = () => {
    setOpenDeleteItemDialog(false);
  };

  const handleDeleteItemButton = () => {
    handleClickOpenDeleteItemDialog();
  };

  const deleteItemRequest = async () => {
    try {
      if (itemId) {
        await deleteItem(itemId);
        setOpenDeleteItemDialog(false);
        navigate(`/Users/${itemDetails.ownerId}`, {
          state: {
            snackBarState: true,
            snackBarMessage: "The item was deleted successfully!",
          },
        });
      }
      else {
        throw new Error("error in deleting item");
      }
    }
    catch (exception: any) {
      setOpenSnackBar(true);
      setSnackBarError("Error in deleting item");
      setOpenDeleteItemDialog(false);
    }

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: itemDetails.title,
      description: itemDetails.description,
    },
    validationSchema: validationSchema,
    onSubmit: (
      values: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>
    ) => {
      setSubmitting(false);
      setFormValusEditItem(values);
      handleNext();
    },
  });

  const getConditionFronItemDetails = (conditionFromServer: any): any => {
    let contiditionToReturn: any = "";
    conditionArr.forEach(function (value) {
      if (value.text === conditionFromServer) {
        contiditionToReturn = value;
      }
    });

    return contiditionToReturn;
  };

  //snack bar area
  const [openSnackBar, setOpenSnackBar] = React.useState<boolean>(false);
  const [snackBarError, setSnackBarError] = React.useState<string>("");

  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackBar(false);
  };

  useEffect(() => {
    const onWakeFunction = async () => {
      try {
        if (itemId) {
          itemServerDetails = (await getItem(itemId)) as IItemResponse;
          setItemDetails(itemServerDetails);
          setCondition(itemServerDetails.condition);
          setSelectedCategories(itemServerDetails.categories);
          setAddress({
            latitude: itemServerDetails.latitude,
            longitude: itemServerDetails.longitude,
          });
          if (itemServerDetails.images) {
            setImagesFromServer(itemServerDetails.images);
            const imagesInStringFormat: string[] = formatImagesOnRecieve(
              itemServerDetails.images
            );
            setImagesNames(imagesInStringFormat);
            setServerImagesNames(imagesInStringFormat);
          }
        }
      } catch (err) {
        setServerRequestError("Error while loading item");
        setSnackBarError("Error while loading item");
        setOpenSnackBar(true);
      }
    };

    onWakeFunction();
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const getItemAddress = async () => {
      if (
        itemDetails &&
        itemDetails.latitude != 0 &&
        itemDetails.longitude != 0
      ) {
        const a = await getReadableAddressAsync({
          latitude: itemDetails.latitude,
          longitude: itemDetails.longitude,
        });
        setItemAddress(a);
      }
    };
    getItemAddress();
  }, [isLoaded, itemDetails]);

  return (
    <Container>
      <Typography variant="h3">Edit Item</Typography>
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

                      {itemDetails.latitude && itemDetails.longitude && (
                        <AddressField
                          onLoad={onLoad}
                          handlePlaceChanged={handlePlaceChanged}
                          savedAddress={itemAddress}
                        />
                      )}

                      {itemDetails.condition != "" && (
                        <Autocomplete
                          id="condition"
                          options={conditionArr}
                          value={getConditionFronItemDetails(
                            itemDetails.condition
                          )}
                          getOptionLabel={(option: any) => option.text}
                          onChange={(event, value) => {
                            setCondition(value.text);
                            setItemDetails({
                              ...itemDetails,
                              condition: value.text,
                            });
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
                      )}

                      {/* categories - Autocomplete */}
                      <Stack spacing={3}>
                        {itemDetails.categories.length > 0 && (
                          <Autocomplete
                            defaultValue={itemDetails.categories}
                            multiple
                            id="editCategories"
                            options={categoryArr}
                            getOptionLabel={(option: any) => option}
                            filterSelectedOptions
                            onChange={(event, value) => {
                              setSelectedCategories(value);
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
                        )}{" "}
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
                        ? "The item was edited successfully!"
                        : "There was an issue editing the item. please try again."}
                    </Alert>
                  </Snackbar>
                </Typography>

                <Box>
                  <div>
                    <Button
                      disabled={true}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
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
                onChange={handleUploadNewImages}
                multiple
                accept="image/*"
                disabled={formik.isSubmitting}
              />
              <Box sx={{ mb: 2 }}>
                <div>
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

        <div>
          <Button
            variant="contained"
            type="submit"
            disabled={false}
            style={{ marginRight: "8px", padding: "8px 16px" }}
            onClick={handleSaveClick}
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
        </div>

        {itemId && (
          <div>
            <Button
              variant="contained"
              type="button"
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "8px 28px",
                backgroundColor: "red",
                color: "white",
              }}
              onClick={handleDeleteItemButton}

              startIcon={<DeleteIcon />}
            >
              Delete Item
            </Button>

            <Dialog
              open={openDeleteItemDialog}
              onClose={handleCloseDeleteItemDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Delete Item"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this item?
                </DialogContentText>
              </DialogContent>
              <DialogActions style={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={handleCloseDeleteItemDialog}>Cancel</Button>
                <Button onClick={deleteItemRequest} autoFocus>
                  Yes
                </Button>

              </DialogActions>
            </Dialog>
          </div>
        )}

        {activeStep === 2 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography component={"span"}>
              All steps completed
            </Typography>
          </Paper>
        )}

        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
            <Alert onClose={handleCloseSnackBar} severity="error" sx={{ width: '100%' }}>
              {snackBarError}
            </Alert>
          </Snackbar>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditItemPage;
