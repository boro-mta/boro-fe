import { ICoordinate } from "../types";
import { addressesCache } from "./addressesCache";

export const getReadableAddressAsync = async (
  location: ICoordinate
): Promise<string> => {
  const { latitude, longitude } = location;
  if (latitude === undefined || longitude === undefined) {
    return "";
  }
  const cached = addressesCache.get(location);
  if (cached && cached !== "") {
    return cached;
  }

  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`;
  let address = "";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.address) {
      const a = data.address;
      if (a.house_number) {
        address += a.house_number + " ";
      }
      if (a.road) {
        address += a.road + ", ";
      }
      if (a.city) {
        address += a.city;
      }
      addressesCache.set(location, address);
    }
  } catch (error) {
    console.error("Error fetching address:", error);
  }
  return address;
};
const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const getRadiusBetweenTwoPoints = (
  point1: ICoordinate,
  point2: ICoordinate
): number => {
  const earthRadius = 6371000; // Earth's radius in meters

  const lat1 = degToRad(point1.latitude);
  const lon1 = degToRad(point1.longitude);
  const lat2 = degToRad(point2.latitude);
  const lon2 = degToRad(point2.longitude);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
};
