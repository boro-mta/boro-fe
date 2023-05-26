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

export const getReservations = async (
  startDate: string,
  endDate: string,
  party: string
) => {
  const endpoint = `Reservations/Dashboard/${party}?from=${startDate}&to=${endDate}`;
  const reservations = await BoroWSClient.request<IReservation[]>(
    HttpOperation.GET,
    endpoint
  );

  return reservations;
};

export const getAllReservationsData = async (
  startDate: string,
  endDate: string,
  party: string
) => {
  debugger;
  let allReservationsDetails: IReservationRow[] = [];

  let reservations = (await getReservations(
    startDate,
    endDate,
    party
  )) as IReservation[];

  let allReservationDetailsPromises =
    reservations && reservations.length > 0
      ? reservations.map(async (reservation: IReservation) => {
          let itemData = (await getItem(reservation.itemId)) as IItemResponse;
          let itemImg = formatImagesOnRecieve(itemData.images)[0];

          let userData = (await getUserProfile(
            reservation.borrowerId
          )) as IUserProfile;
          let partyImg = userData.image
            ? formatImagesOnRecieve([userData.image])[0]
            : "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png";

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
