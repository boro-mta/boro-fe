import HttpClient from "../api/HttpClient";
import { IFullImageDetails, IInputImage } from "../types";

export const formatImagesOnRecieve = (images: IInputImage[]): string[] => {
  const formattedImages: string[] = images.map(
    (img) => `${img.base64ImageMetaData}, ${img.base64ImageData}`
  );
  return formattedImages;
};

export const getImgById = async (imageId: string) => {
  const { base64ImageMetaData, base64ImageData } = await HttpClient.get(
    `Items/Images/${imageId}`
  );
  return formatImagesOnRecieve([{ base64ImageMetaData, base64ImageData }])[0];
};
