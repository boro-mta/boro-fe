import { IInputImage } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { IItemImageResponse } from "./Models/IItemImageResponse";

export const getImgById = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const imgData = (await BoroWSClient.request<IInputImage>(
    HttpOperation.GET,
    endpoint
  )) as IInputImage;
  return formatImagesOnRecieve([imgData])[0];
};

export const deleteImage = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const response = (await BoroWSClient.request<string>(
    HttpOperation.DELETE,
    endpoint
  )) as string;

  return response;
};

export const addImageToItem = async (
  itemId: string,
  imageInput: IInputImage
) => {
  const endpoint = `Items/${itemId}/Images/Add`;

  const imageId = (await BoroWSClient.request<string>(
    HttpOperation.POST,
    endpoint,
    imageInput
  )) as string;

  return imageId;
};

export const getItemImages = async (itemId: string) => {
  const endpoint = `Items/${itemId}/Images`;

  const images = (await BoroWSClient.request<IItemImageResponse[]>(
    HttpOperation.GET,
    endpoint
  )) as IItemImageResponse[];

  return formatImagesOnRecieve(images);
};
