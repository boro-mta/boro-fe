import { Avatar, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/system/Container/Container";
import React from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "./app/hooks";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import { selectPicture, selectUserName } from "./features/UserSlice";

import { items } from "./mocks/items";
import ImagesCarousel from "./components/ImagesCarousel/ImagesCarousel";

function App() {
  const userName = useAppSelector(selectUserName);
  const picture = useAppSelector(selectPicture);
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "10px" }}>
        Welcome, {userName}!
      </Typography>
      {picture && <Avatar component="div" style={{ height: "150px", width: "150px" }}>
        <ImagesCarousel images={[picture]} />
      </Avatar>}
      <Box>
        <ItemsContainer containerTitle="Tools for your home 🏠" items={items} />
      </Box>
      {userName === "Guest" && (
        <Button
          variant="contained"
          onClick={() => navigate("login")}
          sx={{ width: "100%" }}
        >
          Log in
        </Button>
      )}
      {userName !== "Guest" && (
        <Button
          variant="contained"
          onClick={() => navigate("addItem")}
          sx={{ width: "100%" }}
        >
          Add new item
        </Button>
      )}
    </Container>
  );
}

export default App;
