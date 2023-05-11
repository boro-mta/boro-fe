import React, { useState, useRef, useEffect } from "react";
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
    Divider,
    Card,
    CardMedia,
} from "@mui/material";
import HttpClient from "../api/HttpClient";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { IFullImageDetails, IFullItemDetailsNew, IInputImage, IInputItem } from "../types";
import { IMG_1 } from "../mocks/images";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

type IFullItemDetailsParams = {
    itemId: string;
};

type Props = {};

interface IRowData {
    key: string;
    value: string;
}

interface ITableData {
    tableData: IRowData[];
}

const Row = ({ tableData }: ITableData) => {
    return (
        <div>
            {tableData.map((row, i) => (
                <div key={i}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography
                            variant="body1"
                            sx={{ flexBasis: "50%", color: "darkgray" }}
                        >
                            {row.key}
                        </Typography>
                        <Typography variant="body1" sx={{ flexBasis: "50%" }}>
                            {row.value}
                        </Typography>
                    </div>
                    {i < tableData.length - 1 && <Divider sx={{ margin: "5px" }} />}
                </div>
            ))}
        </div>
    );
};

const RequestToBookPage = (props: Props) => {
    debugger;
    const location = useLocation();
    const { selectedStartDate, selectedEndDate, excludedDates, onDateChange } = location.state;

    const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
        categories: [],
        condition: "",
        itemId: "",
        title: "",
        images: [],
        description: "",
        excludedDates: [],
    });

    const navigate = useNavigate();

    let { itemId } = useParams<IFullItemDetailsParams>();



    const [serverRequestError, setServerRequestError] = useState<any>();

    useEffect(() => {
        const getFullDetails = async () => {
            let fullDetails: IFullItemDetailsNew;
            try {
                // fullDetails = await HttpClient.get(`items/${itemId}`);
                //setItemDetails(fullDetails);
            }
            catch (err) {
                console.log("Error while loading item");
                setServerRequestError(err);
                //todo:show error
            }
        }
        getFullDetails();
    }, []);

    return (
        <Container>
            <Typography variant="h3">Request To Book</Typography>

            {/* <Card sx={{ marginBottom: "10px" }}>
                {itemDetails.images && (
                    <CardMedia component="div" style={{ height: "230px" }}>
                        <ImagesCarousel images={formatImagesOnRecieve(itemDetails.images)} />
                    </CardMedia>
                )}
            </Card> */}
            <Typography variant="h5">{itemDetails.title}</Typography>
            <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
            <Typography variant="h6">About the product</Typography>
            <Typography variant="body1">{itemDetails.description}</Typography>

            <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
            <Row
                tableData={[
                    { key: "Condition", value: itemDetails.condition },
                    { key: "Category", value: itemDetails.categories.join(", ") },
                ]}
            />
            <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />



            <Typography variant="h6">Chosen Dates:</Typography>

            <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
            <Row
                tableData={[
                    { key: "Start Date:", value: selectedStartDate.toDateString() },
                    { key: "End Date:", value: selectedEndDate.toDateString() },
                ]}
            />
            <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <DateRangePicker
                    startDate={selectedStartDate}
                    endDate={selectedEndDate}
                    onChange={() => { }}
                    datesToExclude={excludedDates}
                />
                <Button
                    variant="contained"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => navigate(`/item/${itemId}`)} //todo: change 
                >
                    Edit
                </Button>

            </div>

            <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => navigate(`/item/${itemId}`)} //todo: change 
            >
                Back
            </Button>
        </Container>
    );
};

export default RequestToBookPage;