import { styled } from "@mui/system";
import React, { useState } from "react";
import { Avatar, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/system/Container/Container";
import { useNavigate } from "react-router";
import { useAppSelector } from "./app/hooks";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import {
  selectGuid,
  selectPicture,
  selectUserName,
} from "./features/UserSlice";
import MapIcon from "@mui/icons-material/Map";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Map from "./components/MapComponent/Map";
import { items } from "./mocks/items";
import ImagesCarousel from "./components/ImagesCarousel/ImagesCarousel";
import ItemsMapListContainer from "./components/ItemsMapListContainer/ItemsMapListContainer";

function App() {
  const userName = useAppSelector(selectUserName);
  const picture = useAppSelector(selectPicture);
  const navigate = useNavigate();
  let userGuid = useAppSelector(selectGuid);

  const [toggle, setToggle] = useState<string>("Map");

  const ToggleButton = styled(Button)(({ theme }) => ({
    borderRadius: "24px",
    backgroundColor: "#222222",
    color: "#ffffff",
    textTransform: "none",
    padding: "14px 19px",
    position: "fixed",
    bottom: "5%",
    left: "50%",
    zIndex: 100,
    transform: "translateX(-50%)",
    "&:hover": {
      backgroundColor: "#222222",
    },
    width: "160px",
  }));

  const AppComp = () => (
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
          onClick={() => navigate(`/Users/${userGuid}`)}
          sx={{ width: "100%" }}
        >
          My Profile
        </Button>
      )}
      {userName !== "Guest" && (
        <Button
          variant="contained"
          onClick={() => navigate("addItem")}
          sx={{ width: "100%", margin: "10px 0" }}
        >
          Add new item
        </Button>
      )}
    </>
  );

  const ShowMapButton = () => (
    <ToggleButton endIcon={<MapIcon />} onClick={() => setToggle("Map")}>
      Show map
    </ToggleButton>
  );

  const ShowListButton = () => (
    <ToggleButton
      endIcon={<FormatListBulletedIcon />}
      onClick={() => setToggle("List")}
    >
      Show list
    </ToggleButton>
  );

  return (
    <>
      <ItemsMapListContainer />
    </>
  );
}

export default App;
