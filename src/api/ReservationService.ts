import { ICoordinateRadius, IInputItem, IItem } from "../types";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { IItemResponse } from "./Models/IItemResponse";

export const addReservationRequest = async (reservationDetails: any) => {
    const itemId = reservationDetails.itemId;
    console.log("addReservationRequest - entry with " + itemId);
    const endpoint = `Reservations/${itemId}/Request`;
    const reservationIdObject: any = await BoroWSClient.request<IItemResponse>(
        HttpOperation.POST,
        endpoint,
        reservationDetails
    );

    return reservationIdObject.reservationId;
};

export const getReservation = async (reservationId: string) => {
    console.log("getReservation - entry with " + reservationId);
    const endpoint = `Reservations/${reservationId}`;
    const reservation = await BoroWSClient.request<IItemResponse>(
        HttpOperation.GET,
        endpoint
    );

    return { ...reservation };
};