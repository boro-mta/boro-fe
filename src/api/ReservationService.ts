import { IReservationRow, ReservationStatus } from "../types";
import { IReservation } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import { getImgById } from "./ImageService";
import { getItem } from "./ItemService";
import { IItemResponse } from "./Models/IItemResponse";
import IUserProfile from "./Models/IUserProfile";
import { getUserProfile } from "./UserService";

export const getReservationsByLender = async (
  startDate: Date,
  endDate: Date
) => {
  const endpoint = `/Reservations/Dashboard/Lender?from=${startDate}&to=${endDate}`;
  const reservations = await BoroWSClient.request<IReservation[]>(
    HttpOperation.GET,
    endpoint
  );

  return reservations;
};

export const getAllReservationsDataOfLender = async (
  startDate: Date,
  endDate: Date
) => {
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

          return {
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
        })
      : [];

  allReservationsDetails = await Promise.all(allReservationDetailsPromises);

  return allReservationsDetails;
};
