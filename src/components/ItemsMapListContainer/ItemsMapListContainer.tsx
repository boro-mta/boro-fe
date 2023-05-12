import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import {
  selectGuid,
  selectPicture,
  selectUserName,
} from "../../features/UserSlice";
import { Container, styled } from "@mui/material";
import Map from "../MapComponent/Map";
import MapIcon from "@mui/icons-material/Map";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ToggleButton from "./ToggleButton";
import { useNavigate } from "react-router";
import { ICoordinate, IMarkerDetails } from "../../types";
import HttpClient from "../../api/HttpClient";
import { ListContainer } from "./ListContainer";

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
  const userName = useAppSelector(selectUserName);
  const picture = useAppSelector(selectPicture);
  const userGuid = useAppSelector(selectGuid);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setMyLocation(newCenter);
      },
      () => {
        console.log("Failed to get the user's location");
      }
    );
  }, []);

  useEffect(() => {
    const fetchAndSetMarkers = async () => {
      if (myLocation.latitude !== 0 && myLocation.longitude !== 0) {
        let markers = await HttpClient.get("Items/ByRadius", {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          radiusInMeters: 5000,
        });
        if (Array.isArray(markers)) setLocationsAroundMe(markers);
      }
    };

    fetchAndSetMarkers();
  }, [myLocation]);

  return (
    <>
      {toggle === "List" ? (
        <div style={{ position: "relative", height: "100vh" }}>
          <Container>
            <ListContainer
              navigate={navigate}
              picture={picture}
              userName={userName}
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
          <Map myLocation={myLocation} locationsAroundMe={locationsAroundMe} />
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