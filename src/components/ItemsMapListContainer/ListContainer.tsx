import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ItemsContainer from "../ItemsContainer/ItemsContainer";
import ImagesCarousel from "../ImagesCarousel/ImagesCarousel";
import { Avatar } from "@mui/material";
import { ICoordinate, IMarkerDetails, IUserItem } from "../../types";

const buttonStyles = { width: "100%", margin: "10px 0" };

interface ListContainerProps {
  userName: string;
  picture: string;
  navigate: any;
  userGuid: string;
  myLocation: ICoordinate;
  locationsAroundMe: IMarkerDetails[];
}
export const ListContainer = ({
  userName,
  picture,
  locationsAroundMe,
}: ListContainerProps) => {
  const [itemsAroundMe, setItemsAroundMe] = useState<IUserItem[]>([]);

  useEffect(() => {
    const fetchItemsAroundMe = async () => {
      const fetchItem = async (location: IMarkerDetails) => {
        let currObj: IUserItem = {
          id: location.id,
          title: location.title,
          imageIds: location.imageIds,
        };

        return currObj;
      };

      if (locationsAroundMe) {
        const promises = locationsAroundMe.map(fetchItem);
        Promise.all(promises)
          .then((items) => setItemsAroundMe(items))
          .catch((err) => console.log(err));
      }
    };

    fetchItemsAroundMe();
  }, [locationsAroundMe]);

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "10px" }}>
        Welcome, {userName}!
      </Typography>
      {picture && (
        <Avatar component="div" style={{ height: "150px", width: "150px" }}>
          <ImagesCarousel images={[picture]} />
        </Avatar>
      )}
      <Box>
        <ItemsContainer
          containerTitle="Items Around Me 📍"
          items={itemsAroundMe}
        />
      </Box>
    </>
  );
};
