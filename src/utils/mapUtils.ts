import CustomMarker from "../components/MapComponent/CustomMarker";
import { IMarkerDetails } from "../types";

export const renderMarkersByLocations = (
  map: google.maps.Map,
  locations: IMarkerDetails[],
  onMarkerClick: (itemId: string) => void
) => {
  const infoWindow = new google.maps.InfoWindow();

  return locations.map(({ name, lat, lng }) => {
    const marker = CustomMarker({ lat, lng });

    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent(`
      <div class="info-window">
        <h2>${name}</h2>
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
