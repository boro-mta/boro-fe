import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BackspaceSharpIcon from "@mui/icons-material/BackspaceSharp";
import EditCalendarSharpIcon from "@mui/icons-material/EditCalendarSharp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IFullItemDetailsNew } from "../types";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import {
  checkExcludeDatesArrayContainsDate,
  getFormattedDate,
  getMonthAndDayNumber,
} from "../utils/calendarUtils";
import { getItem } from "../api/ItemService";
import { addReservationRequest, getItemBlockedDates } from "../api/ReservationService";

import { startChat } from "../api/ChatService";
import DateRangeSummary from "../components/DateRangeSummary/DateRangeSummary";
import MinimalItemInfoContainer from "../components/MinimalItemInfoContainer/MinimalItemInfoContainer";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const RequestToBookPage = (props: Props) => {
  const location = useLocation();
  const {
    selectedStartDate,
    selectedEndDate,
    excludedDatesState,
  } = location.state;

  const [requestStartDate, setRequestStartDate] = useState<Date>(
    selectedStartDate
  );
  const [requestEndDate, setRequestEndDate] = useState<Date>(selectedEndDate);

  const [calendarStartDate, setCalendarStartDate] = useState<Date>(
    selectedStartDate
  );
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(selectedEndDate);

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    categories: [],
    condition: "",
    itemId: "",
    title: "",
    images: [],
    description: "",
    excludedDates: [],
    ownerId: "",
  });

  const [excludedDates, setExcludedDates] = useState<Date[]>([]);

  const navigate = useNavigate();

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleStartChat = () => {
    const openNewChat = async () => {
      const [startMonth, startDayNumber] = getMonthAndDayNumber(
        calendarStartDate
      );
      const [endMonth, endDayNumber] = getMonthAndDayNumber(calendarEndDate);
      await startChat(
        itemDetails.ownerId || "",
        `Hi! I would like to schedule the ${itemDetails.title}, Starting from ${startMonth} ${startDayNumber} until ${endMonth} ${endDayNumber}.`
      );
    };
    openNewChat();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    setRequestStartDate(calendarStartDate);
    setRequestEndDate(calendarEndDate);
    setOpen(false);
  };

  const handleConfirmRequest = () => {
    const forRequest = {
      startDate: requestStartDate,
      endDate: requestEndDate,
      itemId,
    };
    sendReservationRequest(forRequest);
    handleStartChat();
  };

  const sendReservationRequest = async (reqBody: any) => {
    try {
      console.log(reqBody);
      const reservationId = await addReservationRequest(reqBody);
      console.log(reservationId);
      navigate(`/reservationDetails/${reservationId}`);
    } catch (e) {
      console.log(e);
    }
  };

  const [serverRequestError, setServerRequestError] = useState<any>();
  const [openServerErrorModal, setOpenServerErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails: IFullItemDetailsNew;
      if (itemId) {
        try {
          fullDetails = (await getItem(itemId)) as IFullItemDetailsNew;
          setItemDetails(fullDetails);

          const toDate = new Date();
          toDate.setMonth(toDate.getMonth() + 3);

          const blockedDatesServer: Date[] = await getItemBlockedDates(
            itemId,
            new Date().toISOString(),
            toDate.toISOString()
          );

          setExcludedDates(blockedDatesServer);

        } catch (err) {
          console.log("Error while loading item");
          setServerRequestError(err);
          setOpenServerErrorModal(true);
        }
      }
    };
    getFullDetails();
  }, []);

  const [selectedDatesError, setSelectedDatesError] = useState<string>("");
  const [openDatesErrorModal, setOpenDatesErrorModal] = useState<boolean>(false);
  const [isValidDates, setIsValidDates] = useState<boolean>();

  const handleChangeDates = (dates: Date[]) => {
    const [selectedStartDate, selectedEndDate] = dates;
    setCalendarStartDate(selectedStartDate);
    setCalendarEndDate(selectedEndDate);
    setSelectedDatesError("");
    let loop: Date = new Date(selectedStartDate);
    if (selectedStartDate && selectedEndDate) {
      while (loop <= selectedEndDate) {
        if (
          excludedDates !== undefined &&
          checkExcludeDatesArrayContainsDate(loop, excludedDates)
        ) {
          setSelectedDatesError(
            "The date " +
            getFormattedDate(loop) +
            " is not available, please choose different dates."
          );
          setIsValidDates(false);
          setOpenDatesErrorModal(true);
          break;
        } else {
          setCalendarStartDate(selectedStartDate);
          setCalendarEndDate(selectedEndDate);
          setSelectedDatesError("");
          setIsValidDates(true);
        }

        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      }
    }
  };

  const handleItemPictureClicked = () => {
    navigate(`/Item/${itemDetails.itemId}`);
  };

  const DatesSection = () => (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <DateRangeSummary startDate={requestStartDate} endDate={requestEndDate} />
      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1, backgroundColor: "#007bff" }}
        onClick={handleClickOpen}
        endIcon={<EditCalendarSharpIcon />}
      >
        Edit Dates
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Dates</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please choose your desired dates:
          </DialogContentText>
          <DateRangePicker
            startDate={calendarStartDate}
            endDate={calendarEndDate}
            onChange={handleChangeDates}
            datesToExclude={excludedDates}
            datesToHighlight={[]}
          />
          {calendarStartDate && (
            <p>start date: {calendarStartDate.toDateString()}</p>
          )}
          {calendarEndDate && <p>end date: {calendarEndDate.toDateString()}</p>}
          <DatesErrorModal />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!isValidDates} onClick={handleChange}>change</Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
  const ButtonsSection = () => (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1, backgroundColor: "red" }}
        onClick={() => navigate(`/item/${itemId}`)}
        startIcon={<BackspaceSharpIcon />}
      >
        Back
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1, backgroundColor: "green" }}
        onClick={handleConfirmRequest}
        endIcon={<CheckCircleIcon />}
      >
        Confirm
      </Button>
    </Paper>
  );

  const ServerErrorModal = () => (
    <Modal open={openServerErrorModal} onClose={() => setOpenServerErrorModal(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography component={"span"} variant="body1">
          {serverRequestError}
        </Typography>
      </Box>
    </Modal>
  );

  const DatesErrorModal = () => (
    <Modal open={openDatesErrorModal} onClose={() => setOpenDatesErrorModal(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography component={"span"} variant="body1">
          {selectedDatesError}
        </Typography>
      </Box>
    </Modal>
  );

  return (
    <Container>
      <MinimalItemInfoContainer
        onClick={handleItemPictureClicked}
        imageData={
          itemDetails.images && formatImagesOnRecieve(itemDetails.images)[0]
        }
        itemTitle={itemDetails.title}
        itemDescription={itemDetails.description}
      />
      <DatesSection />
      <ButtonsSection />
      <ServerErrorModal />
    </Container>
  );
};

export default RequestToBookPage;
