import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function App() {
  return (
    <Box>
      <Link to={`item/1`}>Go to Item 1</Link>
    </Box>
  );
}

export default App;
