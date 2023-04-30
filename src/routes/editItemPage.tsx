import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Alert, Autocomplete, Button, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Snackbar, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { IInputItem } from "../types";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import { allItemDetailsNew } from "../mocks/fullItemsDetails";
import SendIcon from "@mui/icons-material/Send";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import HttpClient from "../api/HttpClient";
import { categoriesOptions, conditionOptions } from "../mocks/items";
import ImageIcon from "@mui/icons-material/Image";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IInputImage } from "../types";
import { IFullItemDetailsNew } from "../types";

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
            }
            catch (err) {
                console.log("Error while loading item");
                setServerRequestError(err);
                //todo:show error
            }
        }

        onWakeFunction();
    }, []);

    console.log("after use effect");
    console.log(itemDetails);

    const [formValuesEditItem, setFormValusEditItem] = React.useState<FormValues>({
        title: itemDetails.title,
        description: itemDetails.description,
    });

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

    const sendRequest = async (obj: any) => {
        let imagesForBody: IInputImage[];
        if (obj.images) {
            imagesForBody = convertImagesTypeFromString(obj.images);
        }
        else {
            imagesForBody = [];
        }

        const reqBody = {
            title: obj.title,
            description: obj.description,
            condition: obj.condition,
            categories: obj.categories,
            images: imagesForBody,
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

    const convertImagesTypeFromString = (imagesArrInString: string[]): IInputImage[] => {
        let imagesForBody: IInputImage[] = imagesArrInString.map((img: string) => {
            const imgProps = img.split(",");
            return {
                base64ImageData: imgProps[1],
                base64ImageMetaData: imgProps[0],
            };
        })

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

    const onAddItem = () => {
        const values: FormValues = formValuesEditItem;
        const forRequest: IInputItem = {
            condition: condition,
            categories: selectedCategories,
            title: values.title,
            description: values.description
        }
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
    const [itemInitialCategories, setItemInitialCategories] = useState<any[]>([]);



    //const serverUrl = 'https://localhost:';
    // const serverPort = '7124'
    //  const serverUserProfileEndpoint = '/Users/' + userId + '/Profile'

    //need to change to api call like other pages, waiting for endpoint
    // useEffect(() => {
    //const url = serverUrl + serverPort + serverUserProfileEndpoint;
    //fetch(url).then((response) => response.json()).then((data) => setUserDetails(data)).then((data) => console.log(data));
    //  }, [userId]);

    //const formik =

    // useFormik({

    //     initialValues: {
    //         firstName: itemDetails.firstName,
    //         lastName: userDetails.lastName,
    //         about: userDetails.about,
    //         profileImage: userDetails.profileImage,
    //         userId: userDetails.userId,
    //         dateJoined: userDetails.dateJoined
    //     },
    //     enableReinitialize: true,
    //     validationSchema: validationSchema,
    //     onSubmit: (
    //         values: IUserDetails,
    //         { setSubmitting }: FormikHelpers<IUserDetails>
    //     ) => {
    //         setTimeout(() => {
    //             alert(JSON.stringify(values, null, 2));
    //             setSubmitting(false);
    //         }, 2000);
    //     },
    // },);
    const navigate = useNavigate();
    const handleCancelClick = () => {
        navigate(`/item/${itemId}`);
    }

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
        debugger;
        conditionArr.forEach(function (value) {
            debugger;
            if (value.text === conditionFromServer) {
                contiditionToReturn = value;
            }
        });

        return contiditionToReturn;
    }

    return (

        // <Container>
        //     <Typography variant="h3">Edit your Details</Typography>
        //     <form onSubmit={formik.handleSubmit}>
        //         <TextField
        //             fullWidth
        //             id="firstName"
        //             name="firstName"
        //             label="First Name"
        //             margin="normal"
        //             value={formik.values.firstName}
        //             onChange={formik.handleChange}
        //             error={
        //                 formik.touched.firstName && Boolean(formik.errors.firstName)
        //             }
        //             helperText={formik.touched.firstName && formik.errors.firstName}
        //         />
        //         <TextField
        //             fullWidth
        //             id="lastName"
        //             name="lastName"
        //             label="Last Name"
        //             margin="normal"
        //             value={formik.values.lastName}
        //             onChange={formik.handleChange}
        //             error={
        //                 formik.touched.lastName && Boolean(formik.errors.lastName)
        //             }
        //             helperText={formik.touched.lastName && formik.errors.lastName}
        //         />
        //         <TextField
        //             fullWidth
        //             id="about"
        //             name="about"
        //             label="About"
        //             multiline
        //             margin="normal"
        //             value={formik.values.about}
        //             onChange={formik.handleChange}
        //             error={formik.touched.about && Boolean(formik.errors.about)}
        //             helperText={formik.touched.about && formik.errors.about}
        //         />
        //         <Button
        //             variant="contained"
        //             type="submit"
        //             disabled={false}
        //             style={{ marginRight: "8px", padding: "8px 16px" }}

        //         >
        //             Save
        //         </Button>
        //         <Button
        //             variant="contained"
        //             type="button"
        //             disabled={false}
        //             style={{ marginLeft: "8px", padding: "8px 16px", backgroundColor: "white", color: "red" }}
        //             onClick={handleCancelClick}
        //         >

        //             Cancel
        //         </Button>

        //         {formik.isSubmitting && <CircularProgress />}
        //     </form>
        // </Container>



        <Container>
            <Typography variant="h3">Edit Item</Typography>
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
                                                value={getConditionFronItemDetails(itemDetails.condition)}
                                                getOptionLabel={(option: any) => option.text}
                                                onChange={(event, value) => {
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
                                                    defaultValue={itemInitialCategories}
                                                    multiple
                                                    id="tags-outlined"
                                                    options={categoryArr}
                                                    getOptionLabel={(option: any) => option.text}
                                                    filterSelectedOptions
                                                    onChange={(event, value) => {
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

export default EditItemPage;