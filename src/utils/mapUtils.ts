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

  return locations.map(({ id, imageId, title, lat, lng }) => {
    const marker = CustomMarker({ lat, lng });

    map.addListener("click", () => infoWindow.close());
    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
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

// export const renderMarkersByLocations = (
//     map: google.maps.Map,
//     locations: IMarkerDetails[],
//     onMarkerClick: (itemId: string) => void
//   ) => {
//     const infoWindow = new google.maps.InfoWindow();

//     return locations.map(({ itemId, name, img, lat, lng }) => {
//       const marker = CustomMarker({ lat, lng });

//       marker.addListener("click", () => {
//         infoWindow.setPosition({ lat, lng });
//         infoWindow.setContent(`
//         <div class="info-window" onClick={() => ${onMarkerClick(itemId)}}>
//           <h2>${name}</h2>
//           <img src=${img} />
//         </div>
//       `);
//         infoWindow.open(map);
//       });

//       return marker;
//     });
//   };
