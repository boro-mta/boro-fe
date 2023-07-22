import React, { useEffect } from "react";
import ItemsMapListContainer from "./components/ItemsMapListContainer/ItemsMapListContainer";
import useLocalStorage from "./hooks/useLocalStorage";
import { useAppDispatch } from "./app/hooks";
import { updateUser } from "./features/UserSlice";
import { ICoordinate } from "./types";

function App() {
  const dispatch = useAppDispatch();

  const [userInfo, setUser] = useLocalStorage("user", "");

  useEffect(() => {
    if (userInfo != "") {
      const userLocalInfo = JSON.parse(userInfo);
      console.log("User information from local storage: ", userLocalInfo);
      let location: ICoordinate = { latitude: 0, longitude: 0 };
      if (userLocalInfo.address && userLocalInfo.address.latitude) {
        location.latitude = userLocalInfo.address.latitude;
      }
      if (userLocalInfo.address && userLocalInfo.address.longitude) {
        location.longitude = userLocalInfo.address.longitude;
      }

      dispatch(
        updateUser({
          name: userLocalInfo.name,
          email: userLocalInfo.email,
          facebookId: userLocalInfo.facebookId,
          accessToken: userLocalInfo.accessToken,
          picture: userLocalInfo.picture,
          currentAddress: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          serverAddress: {
            //todo: what to put here?
            latitude: 0,
            longitude: 0,
          },
          userId: userLocalInfo.guid,
        })
      );
    }
  }, []);

  return (
    <>
      <ItemsMapListContainer />
    </>
  );
}

export default App;
