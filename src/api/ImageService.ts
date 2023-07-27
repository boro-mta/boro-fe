import { IInputImage } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { HttpOperation, requestAsync } from "./BoroWebServiceClient";

export const getImage = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const imgData = (await requestAsync<IInputImage>(
    HttpOperation.GET,
    endpoint
  )) as IInputImage;
  return formatImagesOnRecieve([imgData])[0];
};

export const deleteImage = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const response = (await requestAsync<string>(
    HttpOperation.DELETE,
    endpoint
  )) as string;

  return response;
};
