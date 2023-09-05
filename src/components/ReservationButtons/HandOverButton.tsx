import { Button } from "@mui/material";
import React from "react";
import { handOverToBorrower } from "../../api/ReservationService";

const handleHandOverItem = async (reservationId: any) => {
    if (reservationId) {
        await handOverToBorrower(reservationId);
        window.location.reload();
    }
}

type IProps = {
    reservationId: string;
};

const HandOverButton = ({ reservationId }: IProps) => {
    return (
        <Button
            variant="contained"
            type="submit"
            disabled={false}
            style={{ marginRight: "8px", padding: "8px 16px" }}
            onClick={() => {
                handleHandOverItem(reservationId);
            }}
        >
            Hand Over Item
        </Button>
    );
};

export default HandOverButton;
