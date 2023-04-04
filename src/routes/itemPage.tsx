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
    description: ''
  });
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

      <Button
        variant="contained"
        sx={{ position: "sticky", bottom: "10px", right: "2%", width: "96%" }}
        onClick={() => navigate("/")}
      >
        Find available dates
      </Button>
    </Container>
  );
};

export default itemPage;
