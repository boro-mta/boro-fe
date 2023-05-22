import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, Container } from "@mui/material";
import DateContainer from "../components/DateContainer/DateContainer";
import MinimizedItemDetails from "../components/Dashboard/MinimizedItemDetails/MinimizedItemDetails";

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
    itemTitle: "Item 1",
    itemImg: "path-to-item-1-image",
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
    itemTitle: "Item 2",
    itemImg: "path-to-item-2-image",
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
    itemTitle: "Item 3",
    itemImg: "path-to-item-2-image",
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
    itemTitle: "Item 2",
    itemImg: "path-to-item-2-image",
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
    <Container>
      <>
        <TableContainer component={Paper}>
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
                    {row.itemTitle}
                  </TableCell>
                  <TableCell>
                    <MinimizedItemDetails
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Container>
  );
};

export default lenderDashboard;
