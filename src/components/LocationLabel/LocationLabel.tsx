import React, { useEffect, useState } from "react";
import { ICoordinate } from "../../types";
import {
  getRadiusBetweenTwoPoints,
  getReadableAddress,
} from "../../utils/googleMapsUtils";

type Props = {
  itemLocation: ICoordinate;
  userLocation: ICoordinate;
};

const LocationLabel = ({ itemLocation, userLocation }: Props) => {
  const [address, setAddress] = useState<string>("");
  const [radius, setRadius] = useState(-1);
  const [distanceString, setDistanceString] = useState<string>("");
  const [locationsValid, setLocationsValid] = useState<{
    item: boolean;
    user: boolean;
  }>({
    item: false,
    user: false,
  });

  useEffect(() => {
    const validItemLocation =
      itemLocation.latitude !== 0 && itemLocation.longitude !== 0;
    const validUserLocation =
      userLocation.latitude !== 0 && userLocation.longitude !== 0;

    setLocationsValid({ user: validUserLocation, item: validItemLocation });
  });

  useEffect(() => {
    getReadableAddress(itemLocation, (a) => {
      if (a && a !== "") {
        setAddress(a);
      }
    });

    const r =
      locationsValid.item && locationsValid.user
        ? getRadiusBetweenTwoPoints(itemLocation, userLocation)
        : -1;

    setRadius(r);
  }, [locationsValid]);

  useEffect(() => {
    let dString;
    if (address !== "" && radius > -1) {
      const unit = radius < 1000 ? "meters" : "km";
      const distance = radius < 1000 ? radius : radius / 1000.0;
      dString = `${address} - ${distance.toFixed(2)} ${unit} away from you`;
    } else if (address !== "") {
      dString = address;
    } else {
      dString = "";
    }

    setDistanceString(dString);
  }, [address, radius]);

  return distanceString !== "" && <p>{distanceString}</p>;
};

export default LocationLabel;
