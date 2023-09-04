import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectUserId,
  selectPicture,
  selectUserName,
  setCurrentLocation,
} from "../../features/UserSlice";
import { Alert, Button, Collapse, Container, IconButton } from "@mui/material";
import Map from "../MapComponent/Map";
import MapIcon from "@mui/icons-material/Map";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ToggleButton from "./ToggleButton";
import { useNavigate } from "react-router";
import { ICoordinate, ICoordinateRadius, IMarkerDetails } from "../../types";
import { ListContainer } from "./ListContainer";
import { getItemsByRadius } from "../../api/ItemService";
import { IItemResponse } from "../../api/Models/IItemResponse";
import { items } from "../../mocks/items";
import CloseIcon from "@mui/icons-material/Close";

const ItemsMapListContainer = () => {

  const navigate = useNavigate();

  const [toggle, setToggle] = useState<string>("List");
  const [myLocation, setMyLocation] = useState<ICoordinate>({
    latitude: 0,
    longitude: 0,
  });
  const [locationsAroundMe, setLocationsAroundMe] = useState<IMarkerDetails[]>(
    []
  );
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const userGuid = useAppSelector(selectUserId);
  const picture = useAppSelector(selectPicture);

  const [radiusInMeters, setRadiusInMeters] = useState(5000);

  useEffect(() => {
    let currLocation;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        currLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setMyLocation(currLocation);
      },
      () => {
        currLocation = {
          latitude: 32.08602761576923,
          longitude: 34.774667,
        };
        setMyLocation(currLocation);
        console.log("Failed to get the user's location");
      }
    );
  }, []);

  useEffect(() => {
    myLocation.latitude !== 0 &&
      myLocation.longitude !== 0 &&
      dispatch(setCurrentLocation(myLocation));
  }, [myLocation]);

  useEffect(() => {
    const fetchAndSetMarkers = async () => {
      if (myLocation.latitude !== 0 && myLocation.longitude !== 0) {
        let coordinateToSearch: ICoordinateRadius = {
          ...myLocation,
          radiusInMeters,
        };
        let markers = await getItemsByRadius(coordinateToSearch);
        if (Array.isArray(markers)) {
          setLocationsAroundMe(markers as any);
          markers.length <= 3 ? setIsOpenState(true) : setIsOpenState(false);
        }
      }
    };

    fetchAndSetMarkers();
  }, [myLocation, radiusInMeters]);

  const handleSearchAreaClick = (items: IItemResponse[]) => {
    setLocationsAroundMe(items as any);
  };

  const [isOpenState, setIsOpenState] = useState(true);

  return (
    <>
      {toggle === "List" ? (
        <div style={{ position: "relative", height: "100vh" }}>
          <Container>
            {items.length <= 3 && isOpenState && (
              <Collapse in={isOpenState}>
                <Alert
                  severity="info"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setIsOpenState(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ marginBottom: "15px", marginTop: "15px" }}
                >
                  Looks like there aren't many nearby items. Expand the search
                  area to find more items.
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      setLocationsAroundMe([]);
                      setRadiusInMeters(radiusInMeters * 2);
                    }}
                  >
                    Expand search radius
                  </Button>
                </Alert>
              </Collapse>
            )}

            <ListContainer
              navigate={navigate}
              userGuid={userGuid}
              myLocation={myLocation}
              locationsAroundMe={locationsAroundMe}
            />
          </Container>
          <ToggleButton endIcon={<MapIcon />} onClick={() => setToggle("Map")}>
            Show map
          </ToggleButton>
        </div>
      ) : (
        <>
          <Map
            myLocation={myLocation}
            locationsAroundMe={locationsAroundMe}
            onSearchAreaClick={handleSearchAreaClick}
          />
          <ToggleButton
            endIcon={<FormatListBulletedIcon />}
            onClick={() => setToggle("List")}
          >
            Show list
          </ToggleButton>
        </>
      )}
    </>
  );
};

export default ItemsMapListContainer;
