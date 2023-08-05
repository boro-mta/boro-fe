import React, { useEffect } from "react";
import ItemsMapListContainer from "./components/ItemsMapListContainer/ItemsMapListContainer";
import useLocalStorage from "./hooks/useLocalStorage";
import { useAppDispatch } from "./app/hooks";
import { updateUser } from "./features/UserSlice";
import { ICoordinate } from "./types";

function App() {

  return (
    <>
      <ItemsMapListContainer />
    </>
  );
}

export default App;
