import { ICoordinate } from "../types";
export const libs: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places", "geometry"];

export const getReadableAddress = (
  location: ICoordinate,
  callback: (address: string) => void
): void => {
  if (window.google && window.google.maps) {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(
      location.latitude,
      location.longitude
    );
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        callback(results[0].formatted_address);
        return;
      }
    });
  }
  callback("");
};

export const getRadiusBetweenTwoPoints = (
  point1: ICoordinate,
  point2: ICoordinate
): number => {
  if (window.google && window.google.maps.geometry) {
    return window.google.maps.geometry.spherical.computeDistanceBetween(
      { lat: point1.latitude, lng: point1.longitude },
      { lat: point2.latitude, lng: point2.longitude }
    );
  } else {
    return 0; // Or an appropriate default value
  }
};
