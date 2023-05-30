import Button from "@mui/material/Button";
import React from "react";
import { approveReservation } from "../../api/ReservationService";

const handleApprove = async (reservationId: any) => {
    if (reservationId.reservationId) {
        await approveReservation(reservationId.reservationId);
    }
};

const ApproveButton = (reservationId: any) => {
    return (
        <Button
            variant="contained"
            color="success"
            onClick={() => handleApprove(reservationId)}
        >
            Approve
        </Button>
    )
}

export default ApproveButton