import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { allItemDetailsNew } from "../mocks/fullItemsDetails";
import { IFullItemDetails, IFullItemDetailsNew } from "../types";
import ExtraIncludedItemsContainer from "../components/ExtraIncludedItemsContainer/ExtraIncludedItemsContainer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsRow from "../components/SettingsRow/SettingsRow";
import HttpClient from "../api/HttpClient";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import { checkExcludeDatesArrayContainsDate } from "../utils/calendarUtils";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const Row = ({ conditionStatus }: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Typography variant="body1" sx={{ flexBasis: "50%", color: "darkgray" }}>Condition</Typography>
      <Typography variant="body1" sx={{ flexBasis: "50%" }}>{conditionStatus}</Typography>
    </div>
  )
};

const itemPage = (props: Props) => {
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    category: [],
    condition: '',
    coverPhoto: '',
    itemId: '',
    title: '',
    additionalPhotos: [''],
    description: '',
    excludedDates: []
  });

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedDatesError, setSelectedDatesError] = useState<string>("");

  const handleChangeDates = (dates: any) => {
    const [selectedStartDate, selectedEndDate] = dates;
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    setSelectedDatesError("");
    let loop: Date = new Date(selectedStartDate);
    if (selectedStartDate && selectedEndDate) {
      while (loop <= selectedEndDate) {
        if (checkExcludeDatesArrayContainsDate(loop, itemDetails.excludedDates)) {
          setSelectedDatesError(
            "The date " +
            loop +
            " is not available, please choose different dates."
          );
          break;
        } else {
          setStartDate(selectedStartDate);
          setEndDate(selectedEndDate)
          setSelectedDatesError("");
        }

        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      }
    }
  };

  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails;
      // TODO Fetch from API here according to the itemId, for now we mock the data
      if (itemId !== undefined && itemId.length > 5) {
        fullDetails = await HttpClient.get(`items/${itemId}`);
        fullDetails.images = formatImagesOnRecieve(fullDetails.images);
      } else {
        fullDetails =
          allItemDetailsNew.find((item) => item.itemId === itemId) ||
          allItemDetailsNew[0];
      }
      setItemDetails(fullDetails);
    };

    getFullDetails();
  }, []);

  return (
    <Container>
      <Card sx={{ marginBottom: "10px" }}>
        {itemDetails.coverPhoto && (
          <CardMedia component="div" style={{ height: "230px" }}>
            <ImagesCarousel images={itemDetails.additionalPhotos ? [itemDetails.coverPhoto, ...itemDetails.additionalPhotos] : [itemDetails.coverPhoto]} />
          </CardMedia>
        )}
      </Card>
      <Typography variant="h5">{itemDetails.title}</Typography>
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Typography variant="h6">About the product</Typography>
      <Typography variant="body1">
        {itemDetails.description}
      </Typography>

      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Row conditionStatus={itemDetails.condition} />
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />

      <Typography variant="h6">Find available dates</Typography>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={handleChangeDates}
        datesToExclude={itemDetails.excludedDates}
      />
      {selectedDatesError && <Typography variant="body1">{selectedDatesError}</Typography>}
    </Container>
  );
};

export default itemPage;
