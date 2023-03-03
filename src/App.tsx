import { Box } from "@mui/material";
import React from "react";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";

import { items } from "./mocks/items";

function App() {
  return (
    <Box>
      <ItemsContainer containerTitle="Tools for your home 🏠" items={items} />
    </Box>
  );
}

export default App;
