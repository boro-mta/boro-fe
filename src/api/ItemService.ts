import { ICoordinateRadius, IInputItem, IUserItem } from "../types";
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

export const getItemsByRadius = async (coordinate: ICoordinateRadius) => {
  const endpoint = `Items/ByRadius?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}&radiusInMeters=${coordinate.radiusInMeters}`;
  const itemsInRadius = await BoroWSClient.request<IItemResponse>(
    HttpOperation.GET,
    endpoint
  );

  return itemsInRadius;
};

export const getItemsByUser = async (userId: string) => {
  const endpoint = `Items/OfUser/${userId}`;
  const itemsOfUser = (await BoroWSClient.request<IUserItem[]>(
    HttpOperation.GET,
    endpoint
  ));

  return itemsOfUser;
};

export const updateItemLocation = async (
  itemId: string,
  latitude: number,
  longitude: number
) => {
  const endpoint = `Items/${itemId}/Update/Location?latitude=${latitude}&longitude=${longitude}`;
  const response = await BoroWSClient.request<string>(
    HttpOperation.POST,
    endpoint
  );

  return response;
};

export const blockDate = async (datesToBlock: string[], itemId: string) => {
  console.log("blockDate - entry with ", itemId, ",  ", datesToBlock);
  const endpoint = `Reservations/${itemId}/BlockDates`;
  await BoroWSClient.request<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    datesToBlock
  );
};

export const getItemBlockedDates = async (itemId: string, from: string, to: string) => {
  console.log("getBlockedkDates - entry with ", itemId, ", from: ", from, ", to: ", to);
  const endpoint = `Reservations/${itemId}/BlockedDates?from=${from}&to=${to}`;
  const response = await BoroWSClient.request<any>(
    HttpOperation.GET,
    endpoint
  );

  let blockedDates: Date[] = [];

  if (response) {
    response.forEach((element: any) => {
      blockedDates.push(new Date(element));
    });
  }

  return blockedDates;
};
