import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Button,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Box } from "@mui/system";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router";

type Props = {};

const AddNewItemBox = (props: Props) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Card
        sx={{
          maxWidth: 345,
          margin: "10px",
          borderRadius: "8px",
          border: "2px solid lightblue",
        }}
      >
        <CardActionArea onClick={() => navigate("/addItem")}>
          <CardMedia
            component="img"
            height="194"
            image="/assets/addNewItemImage.png"
            alt="Paella dish"
          />
          <CardContent>
            <Typography variant="h6" sx={{ textAlign: "center" }} gutterBottom>
              Add your items today and help the environment and others!
            </Typography>
            <Button
              variant="outlined"
              sx={{ textTransform: "none", width: "100%" }}
            >
              Add item!
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default AddNewItemBox;
