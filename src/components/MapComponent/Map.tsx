import React, { useState, useEffect, useCallback, memo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { ICoordinate, IMarkerDetails } from "../../types";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import CustomMarker from "./CustomMarker";
import "./mapStyles.css";
import { useNavigate } from "react-router";
import { getImgById } from "../../api/ImageService";
import { getItemsByRadius } from "../../api/ItemService";

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
)[] = ["places", "geometry"];

const Map = memo(({ myLocation, locationsAroundMe }: Props) => {
  const navigate = useNavigate();
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState<ICoordinate>(myLocation);
  const [locationsAroundMeUpdated, setLocationsAroundMeUpdated] = useState<
    IMarkerDetails[]
  >(locationsAroundMe);
  const [isShowSearchThisAreaButton, setIsShowSearchThisAreaButton] = useState<
    boolean
  >(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
    libraries: libs,
  });

  const returnToCenter = () => {
    if (map) {
      map.panTo({ lat: myLocation.latitude, lng: myLocation.longitude });
      setCenter(myLocation);
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
    [locationsAroundMeUpdated]
  );

  const addMarkers = useCallback(
    (map: google.maps.Map) => {
      const newMarkers = renderMarkersByLocations(
        map,
        locationsAroundMeUpdated,
        handleMarkerClick
      );

      const algorithm = new SuperClusterAlgorithm({ radius: 200 });
      let clusterer;
      if (newMarkers) {
        clusterer = new MarkerClusterer({
          markers: newMarkers,
          map,
          algorithm,
        });
        if (clusterer && typeof clusterer.draw === "function") clusterer.draw();
      }
      if (map && clusterer) {
        map.set("clusterer", clusterer);
      }
      setMarkers(newMarkers); // Store the markers in state
    },
    [locationsAroundMeUpdated]
  );

  useEffect(() => {
    if (map) {
      addMarkers(map);
    }
  }, [addMarkers, map]);

  useEffect(() => {
    if (map && center && myLocation && center !== myLocation) {
      setIsShowSearchThisAreaButton(true);
    }
  }, [map, center, myLocation]);

  async function fetchMarkers() {
    const response = await getItemsByRadius({
      ...center,
      radiusInMeters: 5000,
    });
    return response;
  }

  if (!isLoaded) {
    return <div>Loading..</div>;
  }

  function handleChangeCenter() {
    try {
      let center: ICoordinate = { latitude: 0, longitude: 0 };
      if (map && typeof map.getCenter === "function") {
        const c = map.getCenter();

        if (
          map &&
          c &&
          typeof c.lat === "function" &&
          typeof c.lng === "function"
        ) {
          center = { latitude: c.lat(), longitude: c.lng() };
        }

        setCenter(center);
      }
    } catch (error) {
      console.error("Error handling center change:", error);
      // Handle the error as needed, e.g., display an error message to the user
    }
  }

  async function searchThisArea() {
    try {
      markers.forEach((marker) => {
        marker.setMap(null); // Remove marker from the map
        marker.unbindAll(); // Unbind event listeners to prevent memory leaks
        marker.setVisible(false);
      });
      setMarkers([]); // Clear the markers array

      const clusterer = map && map.get("clusterer");
      if (clusterer) {
        clusterer.clearMarkers();
      }

      const newMarkers = await fetchMarkers();
      setLocationsAroundMeUpdated(newMarkers as any);

      // Check if the cluster has zero markers and remove it
      if (
        clusterer &&
        typeof clusterer.getMarkers === "function" &&
        clusterer.getMarkers().length === 0
      ) {
        clusterer.removeCluster();
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
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
          center={{ lat: center.latitude, lng: center.longitude }}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
          onDragEnd={handleChangeCenter}
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
        {isShowSearchThisAreaButton && (
          <button
            onClick={searchThisArea}
            style={{
              height: "50%",
              color: "red",
            }}
          >
            Search this area
          </button>
        )}
      </div>
    </div>
  );
});

export default Map;
