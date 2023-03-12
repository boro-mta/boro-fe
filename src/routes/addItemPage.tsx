import React from 'react'
import { FormikHelpers, useFormik } from 'formik';
import { Container } from '@mui/system';
import * as yup from 'yup';
import { Button, CircularProgress, TextField } from '@mui/material';

type Props = {}

interface FormValues {
    title: string;
    description: string;
}

const validationSchema = yup.object({
    title: yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    description: yup.string()
        .max(250, 'Must be 250 characters or less')
        .required('Required'),
})

const addItemPage = (props: Props) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }, 2000);
        },
    });

    return (
        <Container>
            <form onSubmit={formik.handleSubmit}>
                <TextField fullWidth
                    id='title'
                    name='title'
                    label="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title} />
                <TextField fullWidth
                    id='description'
                    name='description'
                    label="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description} />
                <Button variant='contained' type="submit" disabled={formik.isSubmitting}>
                    Submit
                </Button>
                {formik.isSubmitting && <CircularProgress />}
            </form>
        </Container>
    )
}

export default addItemPage