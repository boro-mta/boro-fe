import { IInputImage } from "../types";

export const formatImagesOnRecieve = (images: IInputImage[]): string[] => {
  const formattedImages: string[] =
    images && images.length > 0
      ? images.map((img) =>
          img !== null &&
          img.base64ImageMetaData.length > 0 &&
          img.base64ImageData.length > 0
            ? `${img.base64ImageMetaData}, ${img.base64ImageData}`
            : ""
        )
      : [];
  return formattedImages;
};
