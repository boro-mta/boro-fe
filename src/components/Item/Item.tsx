import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Card,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Item.css";
import { getImage } from "../../api/ImageService";

interface IProps {
  itemId: string;
  title: string;
  imgID: string[];
  onClick: (itemId: string) => void;
}

const Item = ({ itemId, title, imgID, onClick }: IProps) => {
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const getItemImage = async () => {
      if (imgID && imgID.length > 0) {
        const imageFromServer = await getImage(imgID[0]);
        setImage(imageFromServer);
      }
    };

    getItemImage();
  }, []);

  return (
    <Box style={{ minWidth: "300px" }}>
      <Card
        style={{
          margin: "10px",
          borderRadius: "8px",
          border: "1px solid gray",
        }}
      >
        <CardActionArea onClick={() => onClick(itemId)}>
          <CardMedia
            component="img"
            height="140"
            src={image}
            sx={{ objectFit: "contain" }}
          />
          <CardContent>
            <Typography gutterBottom variant="body1" component="div">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Item;
