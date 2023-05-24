import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { IReservationRow, ReservationStatus } from "../types";
import DashboardTableSection from "../components/Dashboard/DashboardTableSection/DashboardTableSection";
import { getAllReservationsDataOfLender } from "../api/ReservationService";

type Props = {};

const lenderDashboard = (props: Props) => {
  const [rows, setRows] = useState<IReservationRow[]>([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      let toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 3);

      const reservationsRows = await getAllReservationsDataOfLender(
        new Date().toISOString(),
        toDate.toISOString()
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
