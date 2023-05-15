import React, { useState, useEffect, useCallback, memo } from "react";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { ICoordinate, IMarkerDetails } from "../../types";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import CustomMarker from "./CustomMarker";
import "./mapStyles.css";
import { useNavigate } from "react-router";
import { getImgById } from "../../api/ImageService";

type Props = {
  myLocation: ICoordinate;
  locationsAroundMe: IMarkerDetails[];
};

const libs: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

const Map = memo(({ myLocation, locationsAroundMe }: Props) => {
  const navigate = useNavigate();
  const [map, setMap] = useState<google.maps.Map>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  const returnToCenter = () => {
    if (map) {
      map.panTo({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  };

  const handleMarkerClick = useCallback((itemId: string) => {
    navigate(`/item/${itemId}`);
  }, []);

  const renderMarkersByLocations = useCallback(
    (
      map: google.maps.Map,
      locations: IMarkerDetails[],
      onMarkerClick: (itemId: string) => void
    ) => {
      const infoWindow = new google.maps.InfoWindow();
      (window as any).onMarkerClick = onMarkerClick;

      return locations.length > 0
        ? locations.map(({ id, imageIds, title, latitude, longitude }) => {
            const marker = CustomMarker({ latitude, longitude });

            map.addListener("click", () => infoWindow.close());
            marker.addListener("click", async () => {
              let imgData = await getImgById(imageIds[0]);

              infoWindow.setPosition({ lat: latitude, lng: longitude });
              infoWindow.setContent(`
        <div class="info-window">
          <h2 class="info-title">${title}</h2>
          <img class="info-img" src="${imgData}" />
          <hr class="divider"/>
          <button class="info-button" onclick="onMarkerClick('${id}')">Go to item</button>
        </div>
      `);
              infoWindow.open(map);
            });

            return marker;
          })
        : [];
    },
    [locationsAroundMe]
  );

  const addMarkers = useCallback(
    (map: google.maps.Map) => {
      // TODO get array of markers from server instead of mock locations
      const markers = renderMarkersByLocations(
        map,
        locationsAroundMe,
        handleMarkerClick
      );

      const algorithm = new SuperClusterAlgorithm({ radius: 200 });
      if (markers) new MarkerClusterer({ markers, map, algorithm });
    },
    [locationsAroundMe]
  );

  useEffect(() => {
    if (map) {
      addMarkers(map);
    }
  }, [addMarkers, map]);

  if (!isLoaded) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <GoogleMap
          center={{ lat: myLocation.latitude, lng: myLocation.longitude }}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          {myLocation && (
            <MarkerF
              position={{ lat: myLocation.latitude, lng: myLocation.longitude }}
            />
          )}
        </GoogleMap>
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          right: 0,
          left: 0,
          marginRight: "auto",
          marginLeft: "auto",
          width: "40%",
          height: "20%",
          border: "4px dashed black",
          borderRadius: "12px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={returnToCenter}
          style={{
            height: "50%",
            color: "red",
          }}
        >
          Return to center
        </button>
      </div>
    </div>
  );
});

export default Map;
