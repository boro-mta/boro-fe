import {
  ICoordinateRadius,
  IInputItem,
  IUserItem,
} from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { HttpOperation, requestAsync } from "./BoroWebServiceClient";
import { IItemImageResponse } from "./Models/IItemImageResponse";
import { IItemResponse } from "./Models/IItemResponse";

export const getItem = async (itemId: string) => {
  console.log("getItem - entry with " + itemId);
  const endpoint = `Items/${itemId}`;
  const item = await requestAsync<IItemResponse>(HttpOperation.GET, endpoint);

  return { ...item };
};

export const addItem = async (itemDetails: IInputItem) => {
  console.log("addItem - entry with ", itemDetails);
  const endpoint = "Items/Add";
  const itemId = await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    itemDetails
  );

  return itemId;
};

export const getItemsByRadius = async (coordinate: ICoordinateRadius) => {
  const endpoint = `Items/ByRadius?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&radiusInMeters=${coordinate.radiusInMeters}`;
  const itemsInRadius = await requestAsync<IItemResponse>(
    HttpOperation.GET,
    endpoint
  );

  return itemsInRadius;
};

export const getUserItems = async (userId: string) => {
  const endpoint = `Items/OfUser/${userId}`;
  const itemsOfUser = await requestAsync<IUserItem[]>(
    HttpOperation.GET,
    endpoint
  );

  return itemsOfUser;
};

export const getItemImages = async (itemId: string) => {
  const endpoint = `Items/${itemId}/Images`;

  const images = (await requestAsync<IItemImageResponse[]>(
    HttpOperation.GET,
    endpoint
  )) as IItemImageResponse[];

  return formatImagesOnRecieve(images);
};
