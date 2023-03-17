import { Box } from "@mui/material";
import React from "react";
import { useAppSelector } from "./app/hooks";
import ItemsContainer from "./components/ItemsContainer/ItemsContainer";
import { selectUserName } from "./features/UserSlice";

import { items } from "./mocks/items";

function App() {
  const userName = useAppSelector(selectUserName);

  return (
    <Box>
      <ItemsContainer containerTitle="Tools for your home 🏠" items={items} />
      <div>{userName}</div>
    </Box>
  );
}

export default App;
