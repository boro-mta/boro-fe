import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Divider,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
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
import { addReservationRequest } from "../api/ReservationService";
import { tableCellClasses } from "@mui/material/TableCell";

import { startChat } from "../api/ChatService";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const RequestToBookPage = (props: Props) => {
  const location = useLocation();
  const {
    selectedStartDate,
    selectedEndDate,
    excludedDates,
    onDateChange,
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

  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails: IFullItemDetailsNew;
      if (itemId) {
        try {
          fullDetails = (await getItem(itemId)) as IFullItemDetailsNew;
          setItemDetails(fullDetails);
        } catch (err) {
          console.log("Error while loading item");
          setServerRequestError(err);
          //todo:show error
        }
      }
    };
    getFullDetails();
  }, []);

  const [selectedDatesError, setSelectedDatesError] = useState<string>("");
  const [isValidDates, setIsValidDates] = useState<boolean>();

  //todo: add the invalid dates flow
  const handleChangeDates = (dates: Date[]) => {
    const [selectedStartDate, selectedEndDate] = dates;
    setCalendarStartDate(selectedStartDate);
    setCalendarEndDate(selectedEndDate);
    setSelectedDatesError("");
    let loop: Date = new Date(selectedStartDate);
    if (selectedStartDate && selectedEndDate) {
      while (loop <= selectedEndDate) {
        if (
          itemDetails.excludedDates !== undefined &&
          checkExcludeDatesArrayContainsDate(loop, itemDetails.excludedDates)
        ) {
          setSelectedDatesError(
            "The date " +
              getFormattedDate(loop) +
              " is not available, please choose different dates."
          );
          setIsValidDates(false);
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function createData(key: string, value: string) {
    return { key, value };
  }

  const rows = [
    createData("Start Date", requestStartDate.toDateString()),
    createData("End Date", requestEndDate.toDateString()),
  ];

  return (
    <Container>
      <Typography component={"span"} variant="h3">
        Request To Book
      </Typography>

      {itemDetails.title != "" && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "row",
          }}
        >
          <Card sx={{ marginBottom: "10px", marginRight: "10px" }}>
            {itemDetails.images && (
              <CardMedia
                component="img"
                style={{ height: "130px", width: "130px" }}
                image={formatImagesOnRecieve(itemDetails.images)[0]}
              ></CardMedia>
            )}
          </Card>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5">{itemDetails.title}</Typography>
            <Typography variant="body1">{itemDetails.description}</Typography>
          </div>
        </div>
      )}

      {itemDetails.title != "" && (
        <TableContainer
          component={Paper}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Table aria-label="customized table">
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.key}>
                  <StyledTableCell component="th" scope="row">
                    {row.key}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.value}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <DateRangePicker
          startDate={requestStartDate}
          endDate={requestEndDate}
          onChange={() => {}}
          datesToExclude={excludedDates}
          datesToHighlight={[]}
        />

        <div>
          <Button
            variant="contained"
            sx={{ mt: 1, mr: 1 }}
            onClick={handleClickOpen}
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
              {calendarEndDate && (
                <p>end date: {calendarEndDate.toDateString()}</p>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleChange}>change</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{ mt: 1, mr: 1 }}
          onClick={() => navigate(`/item/${itemId}`)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 1, mr: 1 }}
          onClick={handleConfirmRequest}
        >
          Confirm
        </Button>
      </div>
    </Container>
  );
};

export default RequestToBookPage;
