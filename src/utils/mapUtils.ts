import CustomMarker from "../components/MapComponent/CustomMarker";
import { IMG_1 } from "../mocks/images";
import { IMarkerDetails } from "../types";
import "../components/MapComponent/mapStyles.css";

export const renderMarkersByLocations = (
  map: google.maps.Map,
  locations: IMarkerDetails[],
  onMarkerClick: (itemId: string) => void
) => {
  const infoWindow = new google.maps.InfoWindow();
  (window as any).onMarkerClick = onMarkerClick;

  return locations.map(({ id, imageIds, title, latitude, longitude }) => {
    const marker = CustomMarker({ latitude, longitude });

    map.addListener("click", () => infoWindow.close());
    marker.addListener("click", () => {
      infoWindow.setPosition({ lat: latitude, lng: longitude });
      infoWindow.setContent(`
        <div class="info-window">
          <h2 class="info-title">${title}</h2>
          <img src="${IMG_1}" class="info-img"/>
          <hr class="divider"/>
          <button class="info-button" onclick="onMarkerClick('${id}')">Go to item</button>
        </div>
      `);
      infoWindow.open(map);
    });

    return marker;
  });
};
