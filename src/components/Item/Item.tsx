import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Card,
} from "@mui/material";
import React from "react";
import { IItem } from "../../types";
import "./Item.css";

const Item = ({ itemId, title, description, img }: IItem) => {
  return (
    <Box
      style={{
        minWidth: "300px",
      }}
    >
      <Card
        style={{
          margin: "10px",
          borderRadius: "8px",
          border: "1px solid gray",
        }}
      >
        <CardActionArea onClick={() => console.log(itemId)}>
          <CardMedia component="img" height="140" src={img} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Item;
