import { IReservationRow } from "../types";
import { ReservationStatus } from "../utils/reservationsUtils";

export const rows: IReservationRow[] = [
  {
    reservationId: "reservation-1",
    itemTitle: "Healthcare Erbology",
    itemId: "123",
    itemImg:
      "https://material-kit-pro-react.devias.io/assets/products/product-1.png",
    itemDescription: "Description for Item 1",
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-05-03"),
    status: ReservationStatus.Canceled,
    partyName: "Rita BePita",
    partyId: "123",
    partyImg:
      "https://material-kit-pro-react.devias.io/assets/avatars/avatar-carson-darrin.png",
  },
  {
    reservationId: "reservation-2",
    itemTitle: "Makeup Lancome Rouge",
    itemId: "456",
    itemImg:
      "https://material-kit-pro-react.devias.io/assets/products/product-2.png",
    itemDescription: "Description for Item 2",
    startDate: new Date("2023-05-03"),
    endDate: new Date("2023-05-05"),
    status: ReservationStatus.Approved,
    partyName: "Mor AlfMor",
    partyImg:
      "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png",
    partyId: "456",
  },
  {
    reservationId: "reservation-3",
    itemTitle: "Healthcare Erbology",
    itemId: "789",
    itemImg:
      "https://material-kit-pro-react.devias.io/assets/products/product-1.png",
    itemDescription: "Description for Item 2",
    startDate: new Date("2023-05-07"),
    endDate: new Date("2023-05-16"),
    status: ReservationStatus.Pending,
    partyName: "Alon DoWon",
    partyImg:
      "https://material-kit-pro-react.devias.io/assets/avatars/avatar-anika-visser.png",
    partyId: "789",
  },
  {
    reservationId: "reservation-4",
    itemTitle: "Skincare Soja CO",
    itemId: "111",
    itemImg:
      "https://material-kit-pro-react.devias.io/assets/products/product-5.png",
    itemDescription: "Description for Item 2",
    startDate: new Date("2023-05-09"),
    endDate: new Date("2023-05-11"),
    status: ReservationStatus.Declined,
    partyName: "Alon Mordovai",
    partyImg:
      "https://material-kit-pro-react.devias.io/assets/avatars/avatar-jie-yan-song.png",
    partyId: "111",
  },
];
