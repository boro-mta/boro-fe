import React from "react";
import ItemsMapListContainer from "./components/ItemsMapListContainer/ItemsMapListContainer";
import useLocalStorage from "./hooks/useLocalStorage";
import { useAppDispatch } from "./app/hooks";
import { updateUser } from "./features/UserSlice";

function App() {
  const dispatch = useAppDispatch();

  const [userInfo, setUser] = useLocalStorage("user", "");

  if (userInfo != "") {
    const userLocalInfo = JSON.parse(userInfo);
    console.log("User information from local storage: ", userLocalInfo);
    dispatch(
      updateUser({
        name: userLocalInfo.name,
        email: userLocalInfo.email,
        facebookId: userLocalInfo.facebookId,
        accessToken: userLocalInfo.accessToken,
        picture: userLocalInfo.picture,
        address: { latitude: 0, longitude: 0 },
        userId: userLocalInfo.guid,
      })
    );

  }


  return (
    <>
      <ItemsMapListContainer />
    </>
  );
}

export default App;
