import { Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Autocomplete } from "@react-google-maps/api";
import React, { useRef, useState } from "react";
import { ICoordinate } from "../types";
import { useAppDispatch } from "../app/hooks";
import { updateAddress } from "../features/UserSlice";
import { useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router";

type Props = {};
const libs: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

const MyAddressesPage = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
  const [address, setAddress] = useState<ICoordinate>({
    latitude: 0,
    longitude: 0,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    let place;

    try {
      // Check if autocompleteRef exists and has the getPlace() method
      if (
        autocompleteRef &&
        autocompleteRef.current &&
        typeof autocompleteRef.current.getPlace === "function"
      ) {
        place = autocompleteRef.current.getPlace();
      }
    } catch (error) {
      console.error("Error getting place:", error);
      return;
    }

    // Check if place and place.geometry exist and have the location property
    if (place && place.geometry && place.geometry.location) {
      const newAddress = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };
      setAddress(newAddress);
    } else {
      console.error("Invalid place object:", place);
    }
  };

  const handleSaveAddress = () => {
    console.log("HEREEEEEEEEE");
    dispatch(updateAddress(address));
    navigate("/addItem");
  };

  return (
    <>
      {isLoaded ? (
        <Container>
          <Typography variant="h3">My Address</Typography>
          <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              placeholder="Search"
              style={{ width: "100%", height: "100%" }}
            />
          </Autocomplete>
          <Button onClick={() => handleSaveAddress()}>Save</Button>
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default MyAddressesPage;
