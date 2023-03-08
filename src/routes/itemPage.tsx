import { Container } from "@mui/material";
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
      <div>itemPage {itemId}</div>
      {itemDetails && <div>{itemDetails.title}</div>}
      {itemDetails.images && <ImagesCarousel images={itemDetails.images} />}
    </Container>
  );
};

export default itemPage;
