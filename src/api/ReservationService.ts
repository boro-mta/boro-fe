import {
  IReservationRow,
  ICoordinateRadius,
  IInputItem,
  IItem,
} from "../types";
import { IReservation } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { ReservationStatus } from "../utils/reservationsUtils";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { getImgById } from "./ImageService";
import { getItem } from "./ItemService";
import { IItemResponse } from "./Models/IItemResponse";
import IUserProfile from "./Models/IUserProfile";
import { getUserProfile } from "./UserService";

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

export const getReservationsByLender = async (
  startDate: string,
  endDate: string
) => {
  const endpoint = `Reservations/Dashboard/Lender?from=${startDate}&to=${endDate}`;
  const reservations = await BoroWSClient.request<IReservation[]>(
    HttpOperation.GET,
    endpoint
  );

  return reservations;
};

export const getAllReservationsDataOfLender = async (
  startDate: string,
  endDate: string
) => {
  debugger;
  let allReservationsDetails: IReservationRow[] = [];

  let reservations = (await getReservationsByLender(
    startDate,
    endDate
  )) as IReservation[];

  let allReservationDetailsPromises =
    reservations && reservations.length > 0
      ? reservations.map(async (reservation: IReservation) => {
          let itemData = (await getItem(reservation.itemId)) as IItemResponse;
          let itemImg = formatImagesOnRecieve(itemData.images)[0];

          let userData = (await getUserProfile(
            reservation.borrowerId
          )) as IUserProfile;
          let partyImg = formatImagesOnRecieve([userData.image])[0];

          let x = {
            reservationId: reservation.reservationId,
            itemTitle: itemData.title,
            itemId: reservation.itemId,
            itemImg: itemImg,
            itemDescription: itemData.description || "",
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate),
            partyId: reservation.borrowerId,
            partyImg: partyImg,
            partyName: `${userData.firstName} ${userData.lastName}`,
            status: reservation.status,
          };
          return x;
        })
      : [];

  allReservationsDetails = await Promise.all(allReservationDetailsPromises);

  return allReservationsDetails;
};
