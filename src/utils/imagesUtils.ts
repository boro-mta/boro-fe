import { IFullImageDetails } from "../types";

export const formatImagesOnRecieve = (images: IFullImageDetails[]) => {
  const formattedImages: string[] = images.map(
    (img) => `${img.base64ImageMetaData},${img.base64ImageData}`
  );
  return formattedImages;
};
