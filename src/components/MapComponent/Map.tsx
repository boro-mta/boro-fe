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
import { getImage } from "../../api/ImageService";
import { getItemsByRadius } from "../../api/ItemService";
import ToggleButton from "../ItemsMapListContainer/ToggleButton";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { libs } from "../../utils/googleMapsUtils";
import { IItemResponse } from "../../api/Models/IItemResponse";
import { getRadiusBetweenTwoPoints } from "../../utils/locationUtils";

type Props = {
  myLocation: ICoordinate;
  locationsAroundMe: IMarkerDetails[];
  onSearchAreaClick: (items: IItemResponse[]) => void;
};


type MarkerGroup = {
  location: ICoordinate;
  markers: IMarkerDetails[];
};


function groupMarkersByLocation(markers: IMarkerDetails[]): MarkerGroup[] {
  const markerGroups: MarkerGroup[] = [];

  // Create an object to store markers grouped by location
  const locationMap: { [locationKey: string]: MarkerGroup } = {};

  markers.forEach((marker) => {
    const locationKey = `${marker.latitude},${marker.longitude}`;
    if (locationKey in locationMap) {
      // Add the marker to an existing group
      locationMap[locationKey].markers.push(marker);
    } else {
      // Create a new group for this location
      const newGroup: MarkerGroup = {
        location: {
          latitude: marker.latitude,
          longitude: marker.longitude,
        },
        markers: [marker],
      };
      locationMap[locationKey] = newGroup;
    }
  });

  // Convert the object values to an array of MarkerGroup
  markerGroups.push(...Object.values(locationMap));

  return markerGroups;
}

const Map = memo(
  ({ myLocation, locationsAroundMe, onSearchAreaClick }: Props) => {
    const navigate = useNavigate();
    const [map, setMap] = useState<google.maps.Map>();
    const [center, setCenter] = useState<ICoordinate>(myLocation);
    const [locationsAroundMeUpdated, setLocationsAroundMeUpdated] = useState<
      IMarkerDetails[]
    >(locationsAroundMe);
    const [
      isShowSearchThisAreaButton,
      setIsShowSearchThisAreaButton,
    ] = useState<boolean>(false);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
      libraries: libs,
    });

    const returnToCenter = () => {
      if (
        map &&
        myLocation.latitude !== 0 &&
        myLocation.longitude !== 0 &&
        myLocation.latitude !== 0 &&
        myLocation.longitude !== 0
      ) {
        map.panTo({ lat: myLocation.latitude, lng: myLocation.longitude });
        setCenter(myLocation);
      }
    };

    const handleMarkerClick = useCallback((itemId: string) => {
      navigate(`/item/${itemId}`);
    }, []);

    function addMarkersWithSamePosition(map: any, items: any) {
      const markers: any = [];

      items.forEach((item: any) => {
        const position = { lat: item.latitude, lng: item.longitude };

        // Check if a marker already exists at this position
        const existingMarker = markers.find(
          (marker: any) =>
            marker.getPosition().lat() === position.lat &&
            marker.getPosition().lng() === position.lng
        );

        if (existingMarker) {
          // If a marker already exists, you can display additional information in an InfoWindow
          const contentString = `<div><h2>${item.title}</h2></div>`;
          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          existingMarker.addListener('click', () => {
            infowindow.open(map, existingMarker);
          });
        } else {
          // If no marker exists at this position, create a new one
          const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: item.title,
          });
          markers.push(marker);
        }
      });
    }



    const renderMarkersByLocations = useCallback(
      (
        map: google.maps.Map,
        locations: IMarkerDetails[],
        onMarkerClick: (itemId: string) => void
      ) => {
        const infoWindow = new google.maps.InfoWindow();
        (window as any).onMarkerClick = onMarkerClick;

        const markers: any = [];

        async function createMarkerListHTML(markers: IMarkerDetails[]): Promise<string> {
          if (!markers || markers.length === 0) {
            return '';
          }

          const markerListHTML = markers.map(async (marker, i) => {
            const { id, title, imageIds } = marker;
            const imgData = await getImage(imageIds[0]); // Assuming you want to use the first image if available.

            const marginBottomStyle = i !== markers.length - 1 ? 'margin-bottom: 20px;' : '';
            return `
              <li>
                <div class="info-window">
                  <h2 class="info-title">${title}</h2>
                  <img class="info-img" src="${imgData}" />
                  <hr class="divider"/>
                  <button class="info-button" onclick="onMarkerClick('${id}')">Go to item</button>
                  <div style="${marginBottomStyle}"></div>
                </div>
              </li>
            `;
          });
          const markerListHTMLArr = await Promise.all(markerListHTML);
          return `<ul style="list-style-type:none; padding:0;">${markerListHTMLArr.join('')}</ul>`;
        }

        const groupedMarkers = groupMarkersByLocation(locations);

        return groupedMarkers && groupedMarkers.length > 0 ?
          groupedMarkers.map(({ location, markers }) => {
            const marker = CustomMarker(location);

            map.addListener("click", () => infoWindow.close());
            marker.addListener("click", async () => {

              infoWindow.setPosition({ lat: location.latitude, lng: location.longitude });
              let x = await createMarkerListHTML(markers);
              infoWindow.setContent(x);
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
          if (clusterer && typeof clusterer.draw === "function")
            clusterer.draw();
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
      if (
        map &&
        center &&
        center.latitude !== 0 &&
        center.longitude !== 0 &&
        myLocation &&
        center !== myLocation
      ) {
        setIsShowSearchThisAreaButton(true);
      }
    }, [map, center, myLocation]);

    const getRadius = (): number => {
      let radius;

      if (map) {
        const c = map.getCenter();
        if (c) {
          const bounds = map.getBounds();
          if (bounds) {
            const ne = bounds.getNorthEast();
            radius = getRadiusBetweenTwoPoints(
              { latitude: c.lat(), longitude: c.lng() },
              { latitude: ne.lat(), longitude: ne.lng() }
            );
          }
        }
      }
      return radius ? radius : 5000;
    };

    async function fetchMarkers() {
      const response = await getItemsByRadius({
        ...center,
        radiusInMeters: getRadius(),
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
      setIsShowSearchThisAreaButton(false);
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

        newMarkers && onSearchAreaClick(newMarkers);
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
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              clickableIcons: false,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM, // Position the zoom control in the bottom right corner
              },
            }}
            onLoad={(map) => setMap(map)}
            onDragEnd={handleChangeCenter}
          >
            {myLocation && (
              <MarkerF
                position={{
                  lat: myLocation.latitude,
                  lng: myLocation.longitude,
                }}
              />
            )}
            {map && (
              <div
                style={{
                  position: "absolute",
                  bottom: "115px",
                  right: "15px",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  height: "24px",
                  padding: "3px",
                  zIndex: 1,
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                  cursor: "pointer",
                }}
                onClick={returnToCenter}
              >
                <MyLocationIcon style={{ color: "#666666" }} />
              </div>
            )}
          </GoogleMap>
        </div>

        {isShowSearchThisAreaButton && (
          <ToggleButton
            endIcon={<SearchIcon />}
            onClick={searchThisArea}
            position="top"
          >
            Search this area
          </ToggleButton>
        )}
      </div>
    );
  }
);

export default Map;
