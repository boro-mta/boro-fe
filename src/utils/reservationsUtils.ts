import ApproveButton from "../components/ReservationButtons/ApproveButton";
import CancelButton from "../components/ReservationButtons/CancelButton";
import RejectButton from "../components/ReservationButtons/DeclineButton";

export enum ReservationStatus {
  Canceled = 0,
  Returned = 10,
  Declined = 20,
  Pending = 30,
  Approved = 40,
  Borrowed = 50,
}

export const statusFromNumToString = (statusNum: number): string => {
  switch (statusNum) {
    case 0:
      return "Canceled";
      break;
    case 10:
      return "Returned";
      break;
    case 20:
      return "Declined";
      break;
    case 30:
      return "Pending";
      break;
    case 40:
      return "Approved";
      break;
    case 50:
      return "Borrowed";
      break;
    default:
      return "Status is not available";
      break;
  }
};

export interface IReservationStatusInfo {
  title: string;
  description: string;
  components: any[];
}

export const actionsByStatusAndOwnership = {
  PendingOwner: {
    title: "Pending request",
    description: "Please approve or decline the request.",
    components: [ApproveButton, RejectButton],
  },
  PendingNotOwner: {
    title: "Pending approval",
    description:
      "The lender will review your booking request, come back later for updates!",
    components: [CancelButton],
  },
  CanceledOwner: {
    title: "Reservation is canceled",
    description: "The borrower has canceled this reservation.",
    components: [],
  },
  CanceledNotOwner: {
    title: "Reservation is canceled",
    description: "You have canceled this reservation.",
    components: [],
  },
  DeclinedOwner: {
    title: "Reservation is declined",
    description: "You have declined this reservation.",
    components: [],
  },
  DeclinedNotOwner: {
    title: "Reservation is declined",
    description: "The lender has declined this reservation.",
    components: [],
  },
  ApprovedOwner: {
    title: "Reservation is approved",
    description: "You have approved this reservation.",
    components: [CancelButton],
  },
  ApprovedNotOwner: {
    title: "Reservation is approved",
    description: "The lender approved your reservation!",
    components: [CancelButton],
  },
};

export const generateReservationStatusInfo = (
  status: number,
  isOwner: boolean
): IReservationStatusInfo => {
  switch (status) {
    case ReservationStatus.Pending: {
      if (isOwner) {
        return actionsByStatusAndOwnership.PendingOwner;
      } else {
        return actionsByStatusAndOwnership.PendingNotOwner;
      }
    }
    case ReservationStatus.Approved: {
      if (isOwner) {
        return actionsByStatusAndOwnership.ApprovedOwner;
      } else {
        return actionsByStatusAndOwnership.ApprovedNotOwner;
      }
    }

    case ReservationStatus.Declined: {
      if (isOwner) {
        return actionsByStatusAndOwnership.DeclinedOwner;
      } else {
        return actionsByStatusAndOwnership.DeclinedNotOwner;
      }
    }
    case ReservationStatus.Canceled: {
      if (isOwner) {
        return actionsByStatusAndOwnership.CanceledOwner;
      } else {
        return actionsByStatusAndOwnership.CanceledNotOwner;
      }
    }
  }

  return { title: "", description: "", components: [] };
};
