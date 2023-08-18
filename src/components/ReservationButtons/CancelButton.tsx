import Button from "@mui/material/Button";
import React from "react";
import { cancelReservation } from "../../api/ReservationService";
import { startChat } from "../../api/ChatService";

const cancelReservationRequest = async (reservationId: any) => {
  if (reservationId) {
    await cancelReservation(reservationId);
    window.location.reload();
  }
};

const handleStartChat = (partyId: string, itemName: string) => {
  const openNewChat = async () => {
    await startChat(
      partyId,
      `The request to book ${itemName} has been cancelled.`
    );
  };
  openNewChat();
};

type IProps = {
  reservationId: string;
  partyId: string;
  itemName: string;
};

const CancelButton = ({ reservationId, partyId, itemName }: IProps) => {
  return (
    <Button
      variant="outlined"
      color="error"
      onClick={() => {
        cancelReservationRequest(reservationId);
        handleStartChat(partyId, itemName);
      }}
    >
      Cancel
    </Button>
  );
};

export default CancelButton;
