import React, { useState, useRef, useEffect } from "react";
import { Container } from "@mui/system";
import {
    Button,
    Typography,
    Divider,
    Card,
    CardMedia,
} from "@mui/material";
import HttpClient from "../api/HttpClient";
import { useLocation, useNavigate, useParams } from "react-router";
import { IFullItemDetailsNew } from "../types";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

type IFullItemDetailsParams = {
    itemId: string;
};

type Props = {
    startDate: Date;
    endDate: Date;
    onChange: (dates: any) => void;
    datesToExclude: Date[];
};

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

const BookingCompletedPage = ({ startDate, endDate, datesToExclude, onChange }: Props) => {
    const { state } = useLocation();
    const { selectedStartDate, selectedEndDate, excludedDates, onDateChange } = state;

    const navigate = useNavigate();

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

    useEffect(() => {
        const getFullDetails = async () => {
            let fullDetails: IFullItemDetailsNew;
            try {
                debugger;
                fullDetails = await HttpClient.get(`items/${itemId}`);
                debugger;
                setItemDetails(fullDetails);
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
            <Typography component={'span'} variant="h3">Booking is Completed</Typography>
            <Card sx={{ marginBottom: "10px" }}>
                {itemDetails.images && (
                    <CardMedia component="div" style={{ height: "230px" }}>
                        <ImagesCarousel images={formatImagesOnRecieve(itemDetails.images)} />
                    </CardMedia>
                )}
            </Card>
            <Typography component={'span'} variant="h5">{itemDetails.title}</Typography>
            <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
            <Typography component={'span'} variant="h6">About the product</Typography>
            <Typography component={'span'} variant="body1">{itemDetails.description}</Typography>

            <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
            <Row
                tableData={[
                    { key: "Condition", value: itemDetails.condition },
                    { key: "Category", value: itemDetails.categories.join(", ") },
                ]}
            />
            <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
            <Typography component={'span'} variant="h6">Chosen Dates:</Typography>

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
            </div>

            <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => navigate(`/item/${itemId}`)} //todo: change back to all items?
            >
                Back
            </Button>
        </Container>
    );
};

export default BookingCompletedPage;