import { Button } from "@mui/material";
import React from "react";
import { returnToLender } from "../../api/ReservationService";

const handleReturnedItem = async (reservationId: any) => {
    if (reservationId) {
        await returnToLender(reservationId);
        window.location.reload();
    }
}

type IProps = {
    reservationId: string;
};

const ReturnItemButton = ({ reservationId }: IProps) => {
    return (
        <Button
            variant="contained"
            type="submit"
            disabled={false}
            style={{ marginRight: "8px", padding: "8px 16px" }}
            onClick={() => {
                handleReturnedItem(reservationId);
            }}
        >
            Return Item Back
        </Button>
    );
};

export default ReturnItemButton;