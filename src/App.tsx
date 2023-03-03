import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";

function App() {
  return (
    <Box>
      <ItemsContainer containerTitle="Tools for your home 🏠" />
    </Box>
  );
}

export default App;
