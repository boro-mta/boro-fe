import React from "react";
import { Chip, SxProps, Theme } from "@mui/material";
import { ReservationStatus } from "../../utils/reservationsUtils";

type props = {
  reservationStatus: ReservationStatus;
  sx?: SxProps<Theme> | undefined;
};
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

const ReservationStatusChip = ({ reservationStatus, sx }: props) => {
  return (
    <Chip
      sx={{ ...sx }}
      label={ReservationStatus[reservationStatus]}
      variant="outlined"
      color={getStatusChipColor(reservationStatus)}
    />
  );
};

export default ReservationStatusChip;
