import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { allItemsDetails } from "../mocks/fullItemsDetails";
import { IFullItemDetails } from "../types";
import ExtraIncludedItemsContainer from "../components/ExtraIncludedItemsContainer/ExtraIncludedItemsContainer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsRow from "../components/SettingsRow/SettingsRow";
import HttpClient from "../api/HttpClient";
import { formatImagesOnRecieve } from "../utils/imagesUtils";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const itemPage = (props: Props) => {
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState<IFullItemDetails>(
    allItemsDetails[0]
  );
  let { itemId } = useParams<IFullItemDetailsParams>();

  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails;
      // TODO Fetch from API here according to the itemId, for now we mock the data
      if (itemId !== undefined && itemId.length > 5) {
        fullDetails = await HttpClient.get(`items/${itemId}`);
        fullDetails.images = formatImagesOnRecieve(fullDetails.images);
      } else {
        fullDetails =
          allItemsDetails.find((item) => item.itemId === itemId) ||
          allItemsDetails[0];
      }
      setItemDetails(fullDetails);
    };

    getFullDetails();
  }, []);

  return (
    <Container>
      <Card sx={{ marginBottom: "10px" }}>
        {itemDetails.images && (
          <CardMedia component="div" style={{ height: "230px" }}>
            <ImagesCarousel images={itemDetails.images} />
          </CardMedia>
        )}
      </Card>
      <Typography variant="h5">{itemDetails.title}</Typography>
      <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
        {itemDetails.borrowerAddress}
      </Typography>
      <Divider />
      <Typography variant="body1" sx={{ marginTop: "10px" }} gutterBottom>
        {itemDetails.description}
      </Typography>

      {itemDetails.extraIncludedItems && (
        <ExtraIncludedItemsContainer
          extraIncludedItems={itemDetails.extraIncludedItems}
        />
      )}
      <Divider />
      <SettingsRow
        leftIcon={<CalendarMonthIcon />}
        rowText={"Find available dates"}
        onClick={() => navigate("/calendar")}
      />

      <Button
        variant="contained"
        sx={{ marginTop: "15px" }}
        onClick={() => navigate("/")}
      >
        Go to home
      </Button>
    </Container>
  );
};

export default itemPage;
