import { IInputImage } from "../types";

export const formatImagesOnRecieve = (images: IInputImage[]): string[] => {
  const formattedImages: string[] =
    images && images.length > 0
      ? images.map(
          (img) => `${img.base64ImageMetaData}, ${img.base64ImageData}`
        )
      : [];
  return formattedImages;
};
