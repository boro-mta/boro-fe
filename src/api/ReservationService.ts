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

export const approveReservation = async (reservationId: string) => {
    console.log("approveReservation - entry with " + reservationId);
    const endpoint = `Reservations/${reservationId}/Approve`;
    const reservation = await BoroWSClient.request<IItemResponse>(
        HttpOperation.POST,
        endpoint
    );
};

export const cancelReservation = async (reservationId: string) => {
    console.log("cancelReservation - entry with " + reservationId);
    const endpoint = `Reservations/${reservationId}/Cancel`;
    const reservation = await BoroWSClient.request<IItemResponse>(
        HttpOperation.POST,
        endpoint
    );
};

export const declineReservation = async (reservationId: string) => {
    console.log("declinelReservation - entry with " + reservationId);
    const endpoint = `Reservations/${reservationId}/Decline`;
    const reservation = await BoroWSClient.request<IItemResponse>(
        HttpOperation.POST,
        endpoint
    );
};