import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { IReservationRow } from "../types";
import DashboardTableSection from "../components/Dashboard/DashboardTableSection/DashboardTableSection";
import { getAllReservationsData } from "../api/ReservationService";
import { ReservationStatus } from "../utils/reservationsUtils";
import EmptyDashboardContainer from "../components/Dashboard/EmptyDashboardContainer/EmptyDashboardContainer";

type Props = {};

const borrowerDashboard = (props: Props) => {
  const [rows, setRows] = useState<IReservationRow[]>([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      let toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 3);

      const reservationsRows = await getAllReservationsData(
        new Date().toISOString(),
        toDate.toISOString(),
        "Borrower"
      );
      setRows(reservationsRows);
    };

    fetchDashboard();
  }, []);

  const completedRows = rows.filter(
    (row) =>
      row.endDate < new Date() && row.status !== ReservationStatus.Canceled
  );
  const pendingRows = rows.filter(
    (row) => row.status === ReservationStatus.Pending
  );
  const ongoingRows = rows.filter(
    (row) =>
      row.startDate <= new Date() &&
      row.endDate >= new Date() &&
      row.status === ReservationStatus.Approved
  );
  const upcomingRows = rows.filter(
    (row) =>
      row.startDate > new Date() &&
      row.status !== ReservationStatus.Canceled &&
      row.status !== ReservationStatus.Declined
  );

  if (completedRows.length === 0 &&
    pendingRows.length === 0 &&
    ongoingRows.length === 0 &&
    upcomingRows.length === 0) {
    return (
      <EmptyDashboardContainer backgroundImg="\assets\borrow_2417787.png" buttonImg="\assets\transaction_4504239.png"
        navigateAddress={"/"} generalText="There are no borrow yet." linkText="You can visit our home page and choose any item to borrow:" />
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

export default borrowerDashboard;
