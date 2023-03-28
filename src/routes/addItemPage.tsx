import React, { useState } from "react";
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
} from "@mui/material";
import HttpClient from "../api/HttpClient";
import { useNavigate } from "react-router";
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { options } from "../mocks/items";
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { text } from "stream/consumers";

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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, selectedCategories: readonly string[], theme: Theme) {
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
  const [personName, setPersonName] = React.useState<string[]>([]);


  const [images, setImages] = useState<string[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<any>('');

  const [categoryArr, setCategoryArr] = React.useState<any[]>(options);
  const [selectedCategories, setSelectedCategories] = React.useState<any>([]);

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
      sendRequest({ ...values, images }).then(() => {
        setOpen(true);
        setSubmitting(false);
      });
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
      Array.from(evt.target.files).forEach((file) =>
        filesPromises.push(toBase64(file))
      );
      const filesInBase64 = await Promise.all(filesPromises);
      setImages(filesInBase64);
    }
  };

  const sendRequest = async (obj: any) => {
    const imagesForBody = obj.images.map((img: any) => {
      const imgProps = img.split(",");
      return {
        base64ImageMetaData: imgProps[0],
        base64ImageData: imgProps[1],
        isCover: false,
      };
    });

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

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleNewCategory = (event: any): void => {
    setNewCategory(event.target.value);
  };

  const handleAddButton = (event: any): void => {
    const lastValueNumber: number = options[(options.length) - 1].value;
    const newCategoryByUser: any = { value: lastValueNumber + 1, text: newCategory, selected: true }; //todo: fix any type to the right type
    console.log(categoryArr);
    console.log(options);
  };

  const updateCategoriesState = () => {
    if (checkIfCategoryExist(newCategory)) {
      console.log("This category already exist");
    }
    else {
      const lastValueNumber: number = options[(options.length) - 1].value;
      const newCategoryByUser: object = { value: lastValueNumber + 1, text: newCategory, selected: true };
      addCategoryToArr(newCategoryByUser);
      setNewCategory("");
    }
  }

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
  }

  const addCategoryToArr = (category: any) => {
    setCategoryArr((current: any) => [...current, category]);
  }

  return (
    <Container>
      <Typography variant="h3">Add New Item</Typography>
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
            error={formik.touched.title && Boolean(formik.errors.title)}
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
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />



          {/* categories - chip */}
          <div>
            <FormControl sx={{ m: 0, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Categories</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                // value={
                //   categoryArr.map((val) => {
                //     { return val.text }
                //   })
                // } 
                value={selectedCategories}
                onChange={handleChange}
                input={<OutlinedInput
                  id="select-multiple-chip"
                  label="Categories"
                />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {options.map((name) =>

                  <MenuItem
                    key={name.text}
                    value={name.text}
                    style={getStyles(name.text, selectedCategories, theme)}
                  >
                    {name.text}
                  </MenuItem>

                )}
              </Select>
            </FormControl>
          </div>

          {/* categories - Autocomplete */}
          <Stack spacing={3} sx={{ width: 500 }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={categoryArr}
              getOptionLabel={(option: any) => option.text}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categories"
                  placeholder="Choose categories for your item"
                />
              )}
            />

            <TextField
              id="new-category"
              label="Add Other Category"
              variant="outlined"
              value={newCategory}
              onChange={handleNewCategory}
            />
            <Button
              variant="contained"
              onClick={updateCategoriesState}>
              Add Category
            </Button>
          </Stack>

          <input
            type="file"
            onChange={convertToBase64}
            multiple
            accept="image/*"
            disabled={formik.isSubmitting}
          />
          <LoadingButton
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
            endIcon={<SendIcon />}
            loading={formik.isSubmitting}
            loadingPosition="center"
            variant="contained"
          >
            <span>Submit</span>
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
    </Container>
  );
};

export default addItemPage;
