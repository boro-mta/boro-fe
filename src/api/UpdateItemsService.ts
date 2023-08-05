import { IInputImage } from "../types";
import { HttpOperation, requestAsync } from "./BoroWebServiceClient";
import { IItemResponse } from "./Models/IItemResponse";
import IUpdateItemInfoInput from "./Models/IUpdateItemInfoInput";

export const updateItemInfo = async (
  itemId: string | undefined,
  updateItemInfoInput: IUpdateItemInfoInput
) => {
  console.log("updateItemInfo - entry with ", updateItemInfoInput);
  const endpoint = `Items/${itemId}/Update`;
  await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    updateItemInfoInput
  );
};

export const updateItemLocation = async (
  itemId: string | undefined,
  latitude: number,
  longitude: number
) => {
  const endpoint = `Items/${itemId}/Update/Location?latitude=${latitude}&longitude=${longitude}`;
  const response = await requestAsync<string>(HttpOperation.POST, endpoint);

  return response;
};

export const addItemImages = async (
  itemId: string | undefined,
  images: IInputImage[]
) => {
  console.log(
    `addItemImages - entry with ${itemId} and ${images.length} images`
  );
  const endpoint = `Items/${itemId}/Update/Images/AddImages`;
  const method = HttpOperation.POST;

  const response = (await requestAsync<string[]>(
    method,
    endpoint,
    images
  )) as string[];

  console.log(
    `addItemImages. Sent ${images.length} images to server. Received ${response.length} image ids.`
  );

  return response;
};

export const addItemImage = async (
  itemId: string | undefined,
  image: IInputImage
) => {
  console.log(`addItemImage - entry with ${itemId}`);
  const endpoint = `Items/${itemId}/Update/Images/AddImage`;
  const method = HttpOperation.POST;

  const response = (await requestAsync<string>(
    method,
    endpoint,
    image
  )) as string;

  console.log(`addItemImages. Received image id: ${response}`);

  return response;
};
