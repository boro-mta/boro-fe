import React from "react";
import { IReservationRow } from "../../../types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import DateContainer from "../../../components/DateContainer/DateContainer";
import MinimizedUserDetails from "../../MinimizedUserDetails/MinimizedUserDetails";
import MinimizedItemDetails from "../MinimizedItemDetails/MinimizedItemDetails";
import { ReservationStatus } from "../../../utils/reservationsUtils";
import { useNavigate } from "react-router";
import ReservationStatusChip from "../../ReservationStatusChip/ReservationStatusChip";

type Props = {
  sectionTitle: string;
  rows: IReservationRow[];
};

const DashboardTableSection = ({ sectionTitle, rows }: Props) => {
  const navigate = useNavigate();

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
                      userFullName={row.partyName}
                      profilePictureData={row.partyImg}
                      userId={row.partyId}
                    />
                  </TableCell>
                  <TableCell>
                    <DateContainer date={row.startDate} />
                  </TableCell>
                  <TableCell>
                    <DateContainer date={row.endDate} />
                  </TableCell>
                  <TableCell>
                    <ReservationStatusChip reservationStatus={row.status} />
                  </TableCell>
                  <TableCell>
                    <ArrowForwardIcon
                      fontSize="large"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/reservationDetails/${row.reservationId}`)
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
