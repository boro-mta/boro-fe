import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDetails } from "../types";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
type IUserDetailsParams = {
    userId: string;
};

type Props = {};

const validationSchema = yup.object({
    first_name: yup.string().max(30, "Must be 30 characters or less"),
    last_name: yup.string().max(30, "Must be 30 characters or less"),
    about: yup.string().max(250, "Must be 250 characters or less"),
});


const UserEditPage = (props: Props) => {
    const [userDetails, setUserDetails] = useState<IUserDetails>(
        allUserDetails[2]
    );

    let { userId } = useParams<IUserDetailsParams>();

    const serverUrl = 'https://localhost:';
    const serverPort = '7124'
    const serverUserProfileEndpoint = '/Users/' + userId + '/Profile'

    //need to change to api call like other pages, waiting for endpoint
    useEffect(() => {
        const url = serverUrl + serverPort + serverUserProfileEndpoint;
        fetch(url).then((response) => response.json()).then((data) => setUserDetails(data)).then((data) => console.log(data));
    }, [userId]);

    const formik =

        useFormik({

            initialValues: {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                about: userDetails.about,
                profileImage: userDetails.profileImage,
                userId: userDetails.userId,
                dateJoined: userDetails.dateJoined
            },
            enableReinitialize: true,
            validationSchema: validationSchema,
            onSubmit: (
                values: IUserDetails,
                { setSubmitting }: FormikHelpers<IUserDetails>
            ) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    setSubmitting(false);
                }, 2000);
            },
        },);
    const navigate = useNavigate();
    const handleCancelClick = () => {
        navigate(`/users/${userId}`);
    }

    return (

        <Container>
            <Typography variant="h3">Edit your Details</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    margin="normal"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.firstName && Boolean(formik.errors.firstName)
                    }
                    helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    margin="normal"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={formik.touched.lastName && formik.errors.lastName}
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

                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    disabled={false}
                    style={{ marginLeft: "8px", padding: "8px 16px", backgroundColor: "white", color: "red" }}
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


