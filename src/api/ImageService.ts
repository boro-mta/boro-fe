import { IInputImage } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";

export const getImgById = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const imgData = (await BoroWSClient.request<IInputImage>(
    HttpOperation.GET,
    endpoint
  )) as IInputImage;
  return formatImagesOnRecieve([imgData])[0];
};
