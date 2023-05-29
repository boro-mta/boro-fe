import Button from "@mui/material/Button";
import React from "react";
import { declineReservation } from "../../api/ReservationService";

const handleDecline = async (reservationId: any) => {
    if (reservationId.reservationId) {
        await declineReservation(reservationId.reservationId);
    }
};

const RejectButton = (reservationId: string) => {

    return (
        <Button
            variant="outlined"
            color="error"
            onClick={() => handleDecline(reservationId)}
        >
            Decline
        </Button>
    )
}

export default RejectButton