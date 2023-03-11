import { CardMedia, Container, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { allItemsDetails } from "../mocks/fullItemsDetails";
import { IFullItemDetails } from "../types";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const itemPage = (props: Props) => {
  const [itemDetails, setItemDetails] = useState<IFullItemDetails>(
    allItemsDetails[0]
  );

  let { itemId } = useParams<IFullItemDetailsParams>();

  useEffect(() => {
    // TODO Fetch from API here according to the itemId, for now we mock the data
    const fullDetails =
      allItemsDetails.find((item) => item.itemId === itemId) ||
      allItemsDetails[0];
    setItemDetails(fullDetails);
  }, []);

  return (
    <Container>
      <Card>
        {itemDetails.images && (
          <CardMedia component="div" style={{ height: "230px" }}>
            <ImagesCarousel images={itemDetails.images} />
          </CardMedia>
        )}
      </Card>
      <Typography variant="subtitle1">{itemDetails.title}</Typography>
      <Typography variant="subtitle2" style={{ color: "gray" }}>
        {itemDetails.borrowerAddress}
      </Typography>
    </Container>
  );
};

export default itemPage;
