import React, { useState, useRef } from "react";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import HttpClient from "../api/HttpClient";
import { useNavigate } from "react-router";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { categoriesOptions, conditionOptions } from "../mocks/items";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

type Props = {};

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
  const theme = useTheme();

  const imagesInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>();
  const [imagesNames, setImagesNames] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>("");
  const [newCategory, setNewCategory] = useState<any>("");

  const [categoryArr, setCategoryArr] = React.useState<any[]>(categoriesOptions);
  const [conditionArr, setConditionArr] = React.useState<any[]>(conditionOptions);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );

  const [freeTextChar, setFreeTextChar] = React.useState<string>("");
  const [freeTextCount, setFreeTextCount] = React.useState<number>(0);

  const [formValuesAddItem, setFormValusAddItem] = React.useState<FormValues>({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

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

  const sendRequest = async (obj: any) => {
    let imagesForBody;
    if (obj.images) {
      imagesForBody = obj.images.map((img: any) => {
        const imgProps = img.split(",");
        return {
          base64ImageMetaData: imgProps[0],
          base64ImageData: imgProps[1],
          isCover: false,
        };
      });
    }

    const reqBody = {
      title: obj.title,
      description: obj.description,
      images: imagesForBody,
      ownerId: "someownerId",
      includedExtras: {},
    };

    try {
      const data = await HttpClient.create("items/add", reqBody);
      console.log(data);
      setIsAddSuccess(true);
      navigate(`/item/${data}`);
    } catch (e) {
      setIsAddSuccess(false);
      console.log(e);
    }
  };

  const handleChipCategoriesChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNewCategory = (event: any): void => {
    setNewCategory(event.target.value);
  };

  const updateCategoriesState = () => {
    if (checkIfCategoryExist(newCategory)) {
      console.log("This category already exist");
    } else {
      const lastValueNumber: number = categoriesOptions[categoriesOptions.length - 1].value;
      const newCategoryByUser: object = {
        value: lastValueNumber + 1,
        text: newCategory,
        selected: true,
      };
      addCategoryToArr(newCategoryByUser);
      //todo: make the added category as selected
      setNewCategory("");
    }
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

  const onAddItem = () => {
    const values: FormValues = formValuesAddItem;
    debugger;
    sendRequest({ ...values, images }).then(() => {
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

  const recalculateCharsFreeText = (event: any) => {
    console.log("free text counter event value:", event);
    const charCount = event.target.value.length;
    debugger
    if (charCount === 250) {
      setFreeTextChar(freeTextChar);
    }
    else {
      setFreeTextChar(event.target.value);
    }
    setFreeTextCount(event.target.value.length);
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

  return (
    <Container>
      <Typography variant="h3">Add New Item</Typography>
      <Box
        sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* step 1 */}
          <Step key={"Fill Item Information"}>
            <StepLabel>{"Fill Item Information"}</StepLabel>
            <StepContent>
              <Box sx={{
                height: "100%",
              }}>
                <Typography>
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
                          formik.touched.description && formik.errors.description
                        }
                      />

                      <Autocomplete
                        id="condition"
                        options={conditionArr}
                        getOptionLabel={(option: any) => option.text}
                        onChange={(event, value) => {
                          console.log(value.text);
                          setCondition(value.text);
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
                        <Autocomplete
                          multiple
                          id="tags-outlined"
                          options={categoryArr}
                          getOptionLabel={(option: any) => option.text}
                          filterSelectedOptions
                          onChange={(event, value) => {
                            console.log(value.map(({ text }) => text))
                            setSelectedCategories(value.map(({ text }) => text));
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Categories"
                              placeholder="Choose categories for your item"
                            />
                          )}
                        />

                        {/* <TextField
                          id="new-category"
                          label="Add Other Category"
                          variant="outlined"
                          value={newCategory}
                          onChange={handleNewCategory}
                        />
                        <Button
                          sx={{ mt: 1, mr: 1 }}
                          variant="contained"
                          onClick={updateCategoriesState}
                        >
                          Add Category
                        </Button> */}
                      </Stack>

                      <div>
                        <TextField
                          id="free-text"
                          label="Write Here More Details"
                          multiline
                          rows={5}
                          value={freeTextChar}
                          onChange={recalculateCharsFreeText}
                          sx={{ width: "100%" }}
                        />
                        <p>{freeTextCount}/250</p>
                      </div>

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
            <Typography>All steps completed - you&apos;re finished</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default addItemPage;
