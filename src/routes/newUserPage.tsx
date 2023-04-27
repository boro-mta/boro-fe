import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDetails } from "../types";
import { FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { allUserDetails } from "../mocks/userDetails";
import api from "../api/HttpClient"
type IUserDetailsParams = {
    userId: string;
};

type Props = {};

const validationSchema = yup.object({
    first_name: yup.string().max(30, "Must be 30 characters or less"),
    last_name: yup.string().max(30, "Must be 30 characters or less"),
    about: yup.string().max(250, "Must be 250 characters or less"),
});


const NewUserPage = (props: Props) => {

    let { userId } = useParams<IUserDetailsParams>();

    const formik =

        useFormik({

            initialValues: {
                firstName: " ",
                lastName: " ",
                about: "",
                profileImage: " ",
                userId: " ",
                dateJoined: " "
            },
            enableReinitialize: true,
            validationSchema: validationSchema,
            onSubmit: (
                values: IUserDetails,
                { setSubmitting }: FormikHelpers<IUserDetails>
            ) => {
                setTimeout(() => {
                    setSubmitting(false);
                }, 2000);
            },
        },);
    const navigate = useNavigate();


    const handleCreateNewUserClick = async () => {
        const userDetails = {
            firstName: formik.values.firstName,
            lastName: formik.values.lastName,
            about: formik.values.about,
            email: 'user@example.com'
        };

        try {
            const response = await api.create('Users/Create', userDetails);
            console.log('User created successfully!', response);
            navigate("/users/" + response);
        } catch (error) {
            console.error('Failed to create user:', error);
        }


    }

    return (

        <Container>
            <Typography variant="h3">Welcome to Boro! Enter your details so other Boros can know who you are </Typography>
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
                    placeholder="Tell us about yourself"
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


