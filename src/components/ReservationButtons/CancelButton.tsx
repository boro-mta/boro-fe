import Button from "@mui/material/Button";
import React from "react";
import { cancelReservation } from "../../api/ReservationService";

const cancelReservationRequest = async (reservationId: any) => {
    if (reservationId.reservationId) {
        await cancelReservation(reservationId.reservationId);
        window.location.reload();
    }
};

const CancelButton = (reservationId: any) => {
    return (
        <Button variant="outlined"
            color="error"
            onClick={() => cancelReservationRequest(reservationId)}
        >
            Cancel
        </Button>
    )
}

export default CancelButton






