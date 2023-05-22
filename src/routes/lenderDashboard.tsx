import React from "react";
import { Container } from "@mui/material";
import { IReservationRow, ReservationStatus } from "../types";
import DashboardTableSection from "../components/Dashboard/DashboardTableSection/DashboardTableSection";
type Props = {};

let rows: IReservationRow[] = [
  {
    id: "reservation-1",
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
    requestTimestamp: new Date(),
    updateTimestamp: new Date(),
  },
  {
    id: "reservation-2",
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
    requestTimestamp: new Date(),
    updateTimestamp: new Date(),
  },
  {
    id: "reservation-3",
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
    requestTimestamp: new Date(),
    updateTimestamp: new Date(),
  },
  {
    id: "reservation-4",
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
    requestTimestamp: new Date(),
    updateTimestamp: new Date(),
  },
];

const lenderDashboard = (props: Props) => {
  const completedRows = rows.filter(
    (row) =>
      row.endDate < new Date() && row.status !== ReservationStatus.Canceled
  );
  const pendingRows = rows.filter(
    (row) => row.status === ReservationStatus.Pending
  );
  const ongoingRows = rows.filter(
    (row) => row.startDate <= new Date() && row.endDate >= new Date()
  );
  const upcomingRows = rows.filter((row) => row.startDate > new Date());

  return (
    <Container>
      <DashboardTableSection rows={completedRows} sectionTitle={"Completed"} />
      <DashboardTableSection rows={pendingRows} sectionTitle={"Pending"} />
      <DashboardTableSection rows={ongoingRows} sectionTitle={"Ongoing"} />
      <DashboardTableSection rows={upcomingRows} sectionTitle={"Upcoming"} />
    </Container>
  );
};

export default lenderDashboard;
