import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ItemsContainer from "../ItemsContainer/ItemsContainer";
import ImagesCarousel from "../ImagesCarousel/ImagesCarousel";
import Avatar from "@mui/material/Avatar";
import { ICoordinate, IItem, IMarkerDetails } from "../../types";
import HttpClient from "../../api/HttpClient";
import { formatImagesOnRecieve } from "../../utils/imagesUtils";

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
  navigate,
  userGuid,
  locationsAroundMe,
}: ListContainerProps) => {
  const [itemsAroundMe, setItemsAroundMe] = useState<IItem[]>([]);

  useEffect(() => {
    const fetchItemsAroundMe = async () => {
      const fetchItem = async (location: IMarkerDetails) => {
        let currObj: IItem = {
          itemId: location.id,
          title: location.title,
        };
        try {
          let itemImg = await HttpClient.get(
            `items/images/${location.imageIds[0]}`
          );
          currObj.img = formatImagesOnRecieve([itemImg])[0];
        } catch (err) {
          console.log(err);
        }
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
      {userName === "Guest" ? (
        <Button
          variant="contained"
          onClick={() => navigate("login")}
          sx={buttonStyles}
        >
          Log in
        </Button>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => navigate(`/Users/${userGuid}`)}
            sx={buttonStyles}
          >
            My Profile
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("addItem")}
            sx={buttonStyles}
          >
            Add new item
          </Button>
        </>
      )}
    </>
  );
};
