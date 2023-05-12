import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import { IInputItem } from "../types";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HttpClient from "../api/HttpClient";
import { categoriesOptions, conditionOptions } from "../mocks/items";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IInputImage } from "../types";
import { IFullItemDetailsNew } from "../types";
import { debug } from "console";
import { useAppSelector } from "../app/hooks";
import { selectAddress } from "../features/UserSlice";

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
  const [images, setImages] = useState<string[]>();
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>("");
  const [newCategory, setNewCategory] = useState<any>("");

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

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    categories: [],
    condition: "",
    itemId: "",
    title: "",
    images: [],
    description: "",
    excludedDates: [],
  });
  const [serverRequestError, setServerRequestError] = useState<any>();
  let itemServerDetails: IFullItemDetailsNew;

  useEffect(() => {
    const onWakeFunction = async () => {
      try {
        itemServerDetails = await HttpClient.get(`items/${itemId}`);
        setItemDetails(itemServerDetails);
        setCondition(itemServerDetails.condition);
        setSelectedCategories(itemServerDetails.categories);
      } catch (err) {
        console.log("Error while loading item");
        setServerRequestError(err);
        //todo:show error
      }
    };

    onWakeFunction();
  }, []);

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

  const sendEditRequest = async (obj: any) => {
    const reqBody = {
      title: obj.title,
      description: obj.description,
      condition: obj.condition,
      categories: obj.categories,
    };

    try {
      console.log(reqBody);
      await HttpClient.create(`items/${itemId}/update`, {}, reqBody);
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

  const checkIfCategoryExist = (category: string): boolean => {
    for (let i = 0; i < categoryArr.length; i++) {
      const categoryFromUserLowerCase: string = category.toLowerCase();
      const categoryFromArr: String = categoryArr[i].text;
      const categoryFromArrLowerCase: String = categoryFromArr.toLowerCase();

      if (categoryFromArrLowerCase === categoryFromUserLowerCase) {
        return true;
      }
    }

    return false;
  };

  const addCategoryToArr = (category: any) => {
    setCategoryArr((current: any) => [...current, category]);
  };

  const address = useAppSelector(selectAddress);

  const onEditItem = () => {
    const values: FormValues = formValuesEditItem;
    const forRequest: IInputItem = {
      condition: condition,
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

  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate(`/item/${itemId}`);
  };

  const handleSaveClick = () => {
    onEditItem();
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
    conditionArr.forEach(function(value) {
      if (value.text === conditionFromServer) {
        contiditionToReturn = value;
      }
    });

    return contiditionToReturn;
  };

  return (
    <Container>
      <Typography variant="h3">Edit Item</Typography>
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* step 1 */}
          <Step key={"Fill Item Information"}>
            <StepLabel>{"Fill Item Information"}</StepLabel>
            <StepContent>
              <Box sx={{ height: "100%" }}>
                <Typography>
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
                            placeholder="Choose your item condition"
                          />
                        )}
                      />

                      {/* categories - Autocomplete */}
                      <Stack spacing={3} sx={{ width: 500 }}>
                        {itemDetails.categories.length && (
                          <Autocomplete
                            defaultValue={itemDetails.categories}
                            multiple
                            id="tags-outlined"
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
                      sx={{ width: "100%" }}
                    >
                      {isAddSuccess
                        ? "The item was added successfully!"
                        : "There was an issue adding the item. please try again."}
                    </Alert>
                  </Snackbar>
                </Typography>

                <Box sx={{ mb: 2 }}>
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

        {activeStep === 2 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            {/* todo: change message */}
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default EditItemPage;
