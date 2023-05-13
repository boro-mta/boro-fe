import { ICoordinateRadius, IInputImage } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { IItemResponse } from "./Models/IItemResponse";

export const getItemsByRadius = async (coordinate: ICoordinateRadius) => {
  const endpoint = `Items/ByRadius?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&radiusInMeters=${coordinate.radiusInMeters}`;
  const itemsInRadius = await BoroWSClient.request<IItemResponse>(
    HttpOperation.GET,
    endpoint
  );

  return itemsInRadius;
};

export const getImgById = async (imageId: string) => {
  const endpoint = `Items/Images/${imageId}`;

  const imgData = (await BoroWSClient.request<IInputImage>(
    HttpOperation.GET,
    endpoint
  )) as IInputImage;
  return formatImagesOnRecieve([imgData])[0];
};
