import { CardMedia, Container, Divider, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { allItemsDetails } from "../mocks/fullItemsDetails";
import { IFullItemDetails } from "../types";
import ExtraIncludedItemsContainer from "../components/ExtraIncludedItemsContainer/ExtraIncludedItemsContainer";

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
    </Container>
  );
};

export default itemPage;
