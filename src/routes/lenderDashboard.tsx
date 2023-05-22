import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, Container, Typography } from "@mui/material";
import DateContainer from "../components/DateContainer/DateContainer";
import MinimizedUserDetails from "../components/Dashboard/MinimizedUserDetails/MinimizedUserDetails";
import MinimizedItemDetails from "../components/Dashboard/MinimizedItemDetails/MinimizedItemDetails";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";

type Props = {};

enum ReservationStatus {
  Canceled = 10,
  Returned = 20,
  Declined = 30,
  Pending = 40,
  Approved = 50,
  Borrowed = 60,
}

interface IReservationRow {
  id: string;
  itemTitle: string;
  itemImg: string;
  itemDescription: string;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  partyName: string;
  partyImg: string;
  partyId: string;
  requestTimestamp: Date;
  updateTimestamp: Date;
}

let rows: IReservationRow[] = [
  {
    id: "reservation-1",
    itemTitle: "Healthcare Erbology",
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

interface IReusableTableProps {
  sectionTitle: string;
  rows: IReservationRow[];
}

const ReusableTableSection = ({ sectionTitle, rows }: IReusableTableProps) => {
  const navigate = useNavigate();

  const getStatusChipColor = (
    status: ReservationStatus
  ): "default" | "secondary" | "error" | "primary" | "success" => {
    switch (status) {
      case ReservationStatus.Canceled:
        return "default";
      case ReservationStatus.Returned:
        return "secondary";
      case ReservationStatus.Declined:
        return "error";
      case ReservationStatus.Pending:
        return "primary";
      case ReservationStatus.Approved:
      case ReservationStatus.Borrowed:
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <Typography variant="h6" gutterBottom style={{ margin: "10px 0px" }}>
        {sectionTitle} ({rows.length})
      </Typography>

      {rows.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <MinimizedItemDetails
                      itemId="123"
                      itemImg={row.itemImg}
                      itemCategories={[row.itemDescription]}
                      itemName={row.itemTitle}
                    />
                  </TableCell>
                  <TableCell>
                    <MinimizedUserDetails
                      fullName={row.partyName}
                      profileImg={row.partyImg}
                      partyId={row.partyId}
                    />
                  </TableCell>
                  <TableCell>
                    <DateContainer date={row.startDate} />
                  </TableCell>
                  <TableCell>
                    <DateContainer date={row.endDate} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ReservationStatus[row.status]}
                      variant="outlined"
                      color={getStatusChipColor(row.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <ArrowForwardIcon
                      fontSize="large"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`reservation/${row.id}`)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

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
      <ReusableTableSection rows={completedRows} sectionTitle={"Completed"} />
      <ReusableTableSection rows={pendingRows} sectionTitle={"Pending"} />
      <ReusableTableSection rows={ongoingRows} sectionTitle={"Ongoing"} />
      <ReusableTableSection rows={upcomingRows} sectionTitle={"Upcoming"} />
    </Container>
  );
};

export default lenderDashboard;
