import { IReservationRow } from "../types";
import { IReservation } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { HttpOperation, requestAsync } from "./BoroWebServiceClient";
import { getItem } from "./ItemService";
import { IItemResponse } from "./Models/IItemResponse";
import IUserProfile from "./Models/IUserProfile";
import { getUserProfile } from "./UserService";

export const addReservationRequest = async (reservationDetails: any) => {
  const itemId = reservationDetails.itemId;
  console.log("addReservationRequest - entry with " + itemId);
  const endpoint = `Reservations/${itemId}/Request`;
  const reservationIdObject: any = await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    reservationDetails
  );

  return reservationIdObject.reservationId;
};

export const getReservation = async (reservationId: string) => {
  console.log("getReservation - entry with " + reservationId);
  const endpoint = `Reservations/${reservationId}`;
  const reservation = await requestAsync<IItemResponse>(
    HttpOperation.GET,
    endpoint
  );

  return { ...reservation };
};

export const approveReservation = async (reservationId: string) => {
  console.log("approveReservation - entry with " + reservationId);
  const endpoint = `Reservations/${reservationId}/Approve`;
  const reservation = await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint
  );
};

export const cancelReservation = async (reservationId: string) => {
  console.log("cancelReservation - entry with " + reservationId);
  const endpoint = `Reservations/${reservationId}/Cancel`;
  const reservation = await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint
  );
};

export const declineReservation = async (reservationId: string) => {
  console.log("declinelReservation - entry with " + reservationId);
  const endpoint = `Reservations/${reservationId}/Decline`;
  const reservation = await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint
  );
};

export const getReservations = async (
  startDate: string,
  endDate: string,
  party: string
) => {
  const endpoint = `Reservations/Dashboard/${party}?from=${startDate}&to=${endDate}`;
  const reservations = await requestAsync<IReservation[]>(
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
          let partyId =
            party === "Borrower"
              ? reservation.lenderId
              : reservation.borrowerId;
          let userData = (await getUserProfile(partyId)) as IUserProfile;
          let partyImg = userData.image
            ? formatImagesOnRecieve([userData.image])[0]
            : "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png";

          let fullSingleReservation = {
            reservationId: reservation.reservationId,
            itemTitle: itemData.title,
            itemId: reservation.itemId,
            itemImg: itemImg,
            itemDescription: itemData.description || "",
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate),
            partyId,
            partyImg: partyImg,
            partyName: `${userData.firstName} ${userData.lastName}`,
            status: reservation.status,
          };
          return fullSingleReservation;
        })
      : [];

  allReservationsDetails = await Promise.all(allReservationDetailsPromises);

  return allReservationsDetails;
};

export const blockDates = async (datesToBlock: string[], itemId: string) => {
  console.log("blockDates - entry with ", itemId, ",  ", datesToBlock);
  const endpoint = `Reservations/${itemId}/BlockDates`;
  await requestAsync<IItemResponse>(HttpOperation.POST, endpoint, datesToBlock);
};

export const unBlockDates = async (
  datesToUnBlock: string[],
  itemId: string
) => {
  console.log("unblockDates - entry with ", itemId, ",  ", datesToUnBlock);
  const endpoint = `Reservations/${itemId}/UnblockDates`;
  await requestAsync<IItemResponse>(
    HttpOperation.POST,
    endpoint,
    datesToUnBlock
  );
};

export const getItemBlockedDates = async (
  itemId: string,
  from: string,
  to: string
) => {
  console.log(
    "getBlockedkDates - entry with ",
    itemId,
    ", from: ",
    from,
    ", to: ",
    to
  );
  const endpoint = `Reservations/${itemId}/BlockedDates?from=${from}&to=${to}`;
  const response = await requestAsync<any>(HttpOperation.GET, endpoint);

  let blockedDates: Date[] = [];

  if (response) {
    response.forEach((element: any) => {
      blockedDates.push(new Date(element));
    });
  }

  return blockedDates;
};
