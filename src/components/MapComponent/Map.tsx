import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { ICoordinate, IMarkerDetails } from "../../types";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { renderMarkersByLocations } from "../../utils/mapUtils";
import HttpClient from "../../api/HttpClient";

type Props = {};

const libs: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

const Map = memo((props: Props) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [myLocation, setMyLocation] = useState<ICoordinate>({
    latitude: 0,
    longitude: 0,
  });
  const [locationsAroundMe, setLocationsAroundMe] = useState<IMarkerDetails[]>(
    []
  );
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

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
        console.log(`Location Loaded!`, myLocation);
        let markers = await HttpClient.get("Items/ByRadius", {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          radiusInMeters: 5000,
        });
        setLocationsAroundMe(markers);
      }
    };

    fetchAndSetMarkers();
  }, [myLocation]);
  const returnToCenter = () => {
    if (map) {
      map.panTo({ lat: myLocation.latitude, lng: myLocation.longitude });
    }
  };

  const handleMarkerClick = useCallback((itemId: string) => {
    console.log(itemId);
  }, []);

  const addMarkers = useCallback(
    (map: google.maps.Map) => {
      // TODO get array of markers from server instead of mock locations
      const markers = renderMarkersByLocations(
        map,
        locationsAroundMe,
        handleMarkerClick
      );

      const algorithm = new SuperClusterAlgorithm({ radius: 200 });
      new MarkerClusterer({ markers, map, algorithm });
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
