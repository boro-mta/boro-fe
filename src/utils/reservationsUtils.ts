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
}

export interface IBodyStatus {
    title: string,
    descroption: string,
    components: any[]
}

export const actionsByStatusAndOwnership = {
    PendingOwner: {
        title: "Pending request",
        descroption: "Please approve or decline the request.",
        components: [ApproveButton, RejectButton]
    },
    PendingNotOwner: {
        title: "Pending approval",
        descroption: "The lender will review your booking request, come back later for updates!",
        components: [CancelButton]
    },
    CanceledOwner: {
        title: "Reservation is canceled",
        descroption: "The borrower has canceled this reservation.",
        components: []
    },
    CanceledNotOwner: {
        title: "Reservation is canceled",
        descroption: "You have canceled this reservation.",
        components: []
    },
    DeclinedOwner: {
        title: "Reservation is declined",
        descroption: "You have declined this reservation.",
        components: []
    },
    DeclinedNotOwner: {
        title: "Reservation is declined",
        descroption: "The lender has declined this reservation.",
        components: []
    },
    ApprovedOwner: {
        title: "Reservation is approved",
        descroption: "You have approved this reservation.",
        components: [CancelButton]
    },
    ApprovedNotOwner: {
        title: "Reservation is approved",
        descroption: "The lender approved your reservation!",
        components: [CancelButton]
    },
}

export const getBodyByStatus = (status: number, isOwner: boolean): IBodyStatus => {
    switch (status) {
        case ReservationStatus.Pending: {
            if (isOwner) {
                return actionsByStatusAndOwnership.PendingOwner;
            }
            else {
                return actionsByStatusAndOwnership.PendingNotOwner;
            }
            break;
        }
        case ReservationStatus.Approved: {
            if (isOwner) {
                return actionsByStatusAndOwnership.ApprovedOwner;
            }
            else {
                return actionsByStatusAndOwnership.ApprovedNotOwner;
            }
            break;
        }

        case ReservationStatus.Declined: {
            if (isOwner) {
                return actionsByStatusAndOwnership.DeclinedOwner;
            }
            else {
                return actionsByStatusAndOwnership.DeclinedNotOwner;
            }
            break;
        }
        case ReservationStatus.Canceled: {
            if (isOwner) {
                return actionsByStatusAndOwnership.CanceledOwner;
            }
            else {
                return actionsByStatusAndOwnership.CanceledNotOwner;
            }
            break;
        }
    }

    return { title: "", descroption: "", components: [] };
}