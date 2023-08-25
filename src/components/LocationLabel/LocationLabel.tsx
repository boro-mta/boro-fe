import React, { useEffect, useState } from "react";
import { ICoordinate } from "../../types";
import {
  getRadiusBetweenTwoPoints,
  getReadableAddressAsync,
} from "../../utils/locationUtils";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

type Props = {
  itemLocation: ICoordinate;
  userLocation: ICoordinate;
};

const LocationLabel = ({ itemLocation, userLocation }: Props) => {
  const [distanceString, setDistanceString] = useState<string>("");
  const [addressString, setAddressString] = useState<string>("");
  const [finalLabel, setFinalLabel] = useState<string>("");

  const fetchAddress = async () => {
    const address = await getReadableAddressAsync(itemLocation);

    if (address.trim().length > 0) {
      setAddressString(address);
    }
  };

  const fetchDistance = () => {
    const radius = getRadiusBetweenTwoPoints(itemLocation, userLocation);
    const unit = radius < 1000 ? "meters" : "km";
    const distance = radius < 1000 ? radius : radius / 1000.0;
    setDistanceString(`${distance.toFixed(2)} ${unit} away`);
  };

  useEffect(() => {
    const itemLocationValid =
      itemLocation.latitude !== 0 && itemLocation.longitude !== 0;

    if (itemLocationValid) {
      const userLocationValid =
        userLocation.latitude !== 0 && userLocation.longitude !== 0;

      fetchAddress();
      if (userLocationValid) {
        fetchDistance();
      }
    }
  }, [itemLocation.latitude !== 0 && itemLocation.longitude !== 0]);

  useEffect(() => {
    const generateFinalLabel = () => {
      let final = addressString !== "" ? addressString : "";

      if (final !== "" && distanceString !== "") {
        final += ` (${distanceString})`;
      } else if (distanceString !== "") {
        final = distanceString;
      }
      setFinalLabel(final);
    };

    if (addressString !== "" || distanceString !== "") {
      generateFinalLabel();
    }
  }, [addressString !== "", distanceString !== ""]);

  if (itemLocation.latitude !== 0 && itemLocation.longitude !== 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <PlaceIcon />
        <Typography>{finalLabel}</Typography>
      </Box>
    );
  } else {
    return null;
  }
};

export default LocationLabel;
