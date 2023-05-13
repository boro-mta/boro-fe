import { IInputItem } from "../types";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { IItemResponse } from "./Models/IItemResponse";

export const getItem = async (itemId: string) => {
  console.log("getItem - entry with " + itemId);
  const endpoint = `Items/${itemId}`;
  const item = await BoroWSClient.request<IItemResponse>(
    HttpOperation.GET,
    endpoint
  );

  return { ...item };
};

export const addItem = async (itemDetails: IInputItem) => {
  console.log("addItem - entry with ", itemDetails);
  const endpoint = "Items/Add";
  const itemId = await BoroWSClient.request<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    itemDetails
  );

  return itemId;
};

export const editItem = async (itemDetails: any) => {
  console.log("editItem - entry with ", itemDetails);
  const endpoint = `Items/${itemDetails.itemId}/Update`;
  await BoroWSClient.request<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    itemDetails
  );
};
