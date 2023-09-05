import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { IReservationRow } from "../types";
import DashboardTableSection from "../components/Dashboard/DashboardTableSection/DashboardTableSection";
import { getAllReservationsData } from "../api/ReservationService";
import { ReservationStatus } from "../utils/reservationsUtils";
import EmptyDashboardContainer from "../components/Dashboard/EmptyDashboardContainer/EmptyDashboardContainer";

type Props = {};

const lenderDashboard = (props: Props) => {
  const [rows, setRows] = useState<IReservationRow[]>([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      let toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 3);

      const reservationsRows = await getAllReservationsData(
        new Date().toISOString(),
        toDate.toISOString(),
        "Lender"
      );
      setRows(reservationsRows);
    };

    fetchDashboard();
  }, []);

  const completedRows = rows.filter(
    (row) =>
      // row.endDate < new Date() &&
      row.status !== ReservationStatus.Canceled &&
      row.status !== ReservationStatus.Declined &&
      row.status !== ReservationStatus.Pending &&
      row.status !== ReservationStatus.Borrowed
  );
  const pendingRows = rows.filter(
    (row) => row.status === ReservationStatus.Pending
  );
  const ongoingRows = rows.filter(
    (row) =>
      // row.startDate <= new Date() &&
      // row.endDate >= new Date() &&
      row.status === ReservationStatus.Borrowed
  );
  const upcomingRows = rows.filter(
    (row) =>
      row.startDate > new Date() &&
      row.status !== ReservationStatus.Canceled &&
      row.status !== ReservationStatus.Declined &&
      row.status !== ReservationStatus.Pending &&
      row.status !== ReservationStatus.Returned &&
      row.status !== ReservationStatus.Borrowed
  );

  if (completedRows.length === 0 &&
    pendingRows.length === 0 &&
    ongoingRows.length === 0 &&
    upcomingRows.length === 0) {
    return (
      <EmptyDashboardContainer backgroundImg="\assets\investor_7331026.png" buttonImg="\assets\add-product_7466065.png"
        navigateAddress={"/addItem"} generalText="There are no lendings yet." linkText="You can always add a new item to lend to others:" />
    );
  }
  else {
    return (
      <Container>
        <DashboardTableSection rows={completedRows} sectionTitle={"Completed"} />
        <DashboardTableSection rows={pendingRows} sectionTitle={"Pending"} />
        <DashboardTableSection rows={ongoingRows} sectionTitle={"Ongoing"} />
        <DashboardTableSection rows={upcomingRows} sectionTitle={"Upcoming"} />
      </Container>
    );
  }
};

export default lenderDashboard;
