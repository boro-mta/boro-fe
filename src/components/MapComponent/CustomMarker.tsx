import React from "react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { ICoordinate } from "../../types";

const CustomMarker = ({ lat, lng }: ICoordinate) => {
  return new google.maps.Marker({
    position: { lat, lng },
    icon: {
      path: faLocationDot.icon[4] as string,
      fillColor: "#006DAA",
      fillOpacity: 1,
      anchor: new google.maps.Point(
        faLocationDot.icon[0] / 2, // width
        60 // height
      ),
      strokeWeight: 1,
      strokeColor: "#ffffff",
      scale: 0.11,
    },
  });
};

export default CustomMarker;
