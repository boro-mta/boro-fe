import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDetails } from "../types";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import api from "../api/HttpClient";
import ResponsiveAppBar from "../components/AppBar/AppBar";
type IUserDetailsParams = {
    userId: string;
};

type Props = {};

const validationSchema = yup.object({

    About: yup.string().max(250, "Must be 250 characters or less"),
    Email: yup.string().email(),
    Latitude: yup.string().max(30, "Must be 30 characters or less"),
    Longitude: yup.string().max(30, "Must be 30 characters or less"),
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
                about: userDetails.about,
                email: userDetails.email,
                latitude: 0,
                longitude: 0,
                userId: userDetails.userId,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                profileImage: userDetails.profileImage,
                dateJoined: userDetails.dateJoined,
            },
            enableReinitialize: true,
            validationSchema: validationSchema,
            onSubmit: () => { },
        },);

    const navigate = useNavigate();
    const handleCancelClick = () => {
        navigate(`/users/${userId}`);
    }
    const handleEditClick = async () => {
        const userDetails = {
            about: formik.values.about,
            email: formik.values.email,
            latitude: 0,
            longitude: 0
        };
        try {
            const response = await api.create(`Users/${userId}/Update`, userDetails);
            console.log('User created successfully!', response);
            navigate("/users/" + userId);
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    }

    return (
        <Container>
            <Typography variant="h3">Edit your Details</Typography>
            <form onSubmit={formik.handleSubmit} >
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    margin="normal"
                    required={true}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.email && Boolean(formik.errors.email)
                    }
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


