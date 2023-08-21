import { Button } from "@mui/material";
import React from "react";
import { approveReservation } from "../../api/ReservationService";
import { startChat } from "../../api/ChatService";

const handleApprove = async (reservationId: any) => {
  if (reservationId) {
    await approveReservation(reservationId);
    location.reload();
  }
};

const handleStartChat = (partyId: string, itemName: string) => {
  const openNewChat = async () => {
    await startChat(
      partyId,
      `Your request to book ${itemName} has been confirmed.`
    );
  };
  openNewChat();
};

type IProps = {
  reservationId: string;
  partyId: string;
  itemName: string;
};

const ApproveButton = ({ reservationId, partyId, itemName }: IProps) => {
  return (
    <Button
      variant="contained"
      color="success"
      onClick={() => {
        handleApprove(reservationId);
        handleStartChat(partyId, itemName);
      }}
    >
      Approve
    </Button>
  );
};

export default ApproveButton;
