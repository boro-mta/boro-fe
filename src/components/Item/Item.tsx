import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React from "react";
import "./Item.css";

type Props = {
  itemId: string;
  title: string;
  description?: string;
  img?: string;
};

const Item = ({ itemId, title, description, img }: Props) => {
  return (
    <Box
      style={{
        width: "30%",
      }}
    >
      <Card
        style={{
          borderRadius: "16px",
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
