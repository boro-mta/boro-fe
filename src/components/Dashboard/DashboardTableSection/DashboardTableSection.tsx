import React from "react";
import { IReservationRow, ReservationStatus } from "../../../types";
import { useNavigate } from "react-router";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip, Container, Typography } from "@mui/material";
import DateContainer from "../../../components/DateContainer/DateContainer";
import MinimizedUserDetails from "../MinimizedUserDetails/MinimizedUserDetails";
import MinimizedItemDetails from "../MinimizedItemDetails/MinimizedItemDetails";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type Props = {
  sectionTitle: string;
  rows: IReservationRow[];
};

const DashboardTableSection = ({ sectionTitle, rows }: Props) => {
  const navigate = useNavigate();

  const getStatusChipColor = (status: ReservationStatus) => {
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
                  key={row.reservationId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <MinimizedItemDetails
                      itemId={row.itemId}
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
                      onClick={() =>
                        navigate(`reservation/${row.reservationId}`)
                      }
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

export default DashboardTableSection;
