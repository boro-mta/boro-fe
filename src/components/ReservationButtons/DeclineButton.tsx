import Button from "@mui/material/Button";
import React from "react";
import { declineReservation } from "../../api/ReservationService";
import { startChat } from "../../api/ChatService";

const handleDecline = async (reservationId: any) => {
  if (reservationId.reservationId) {
    await declineReservation(reservationId.reservationId);
  }
};

const handleStartChat = (partyId: string, itemName: string) => {
  const openNewChat = async () => {
    await startChat(
      partyId,
      `Your request to book ${itemName} has been denied.`
    );
  };
  openNewChat();
};

type IProps = {
  reservationId: string;
  partyId: string;
  itemName: string;
};

const RejectButton = ({ reservationId, partyId, itemName }: IProps) => {
  return (
    <Button
      variant="outlined"
      color="error"
      onClick={() => {
        handleDecline(reservationId);
        handleStartChat(partyId, itemName);
      }}
    >
      Decline
    </Button>
  );
};

export default RejectButton;
