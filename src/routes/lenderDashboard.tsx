import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";

type Props = {};

enum ReservationStatus {
  Canceled = 0,
  Returned,
  Declined,
  Pending,
  Approved,
  Borrowed,
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
    status: ReservationStatus.Pending,
    partyName: "Person 1",
    partyImg: "path-to-person-1-image",
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
    partyName: "Person 2",
    partyImg: "path-to-person-2-image",
    requestTimestamp: new Date(),
    updateTimestamp: new Date(),
  },
];

const lenderDashboard = (props: Props) => {
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
                  <TableCell>{row.partyName}</TableCell>
                  <TableCell>
                    {row.startDate.toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {row.endDate.toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
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
