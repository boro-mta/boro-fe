import React, { useState, useRef, useEffect } from "react";
import { Container } from "@mui/system";
import { Button, Typography, Divider, Card, CardMedia } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IFullItemDetailsNew } from "../types";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  checkExcludeDatesArrayContainsDate,
  getFormattedDate,
} from "../utils/calendarUtils";
import { getItem } from "../api/ItemService";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

interface IRowData {
  key: string;
  value: string;
}

interface ITableData {
  tableData: IRowData[];
}

const Row = ({ tableData }: ITableData) => {
  return (
    <div>
      {tableData.map((row, i) => (
        <div key={i}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="body1"
              sx={{ flexBasis: "50%", color: "darkgray" }}
            >
              {row.key}
            </Typography>
            <Typography variant="body1" sx={{ flexBasis: "50%" }}>
              {row.value}
            </Typography>
          </div>
          {i < tableData.length - 1 && <Divider sx={{ margin: "5px" }} />}
        </div>
      ))}
    </div>
  );
};

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
  });

  const navigate = useNavigate();

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = () => {
    setRequestStartDate(calendarStartDate);
    setRequestEndDate(calendarEndDate);
    setOpen(false);
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

  return (
    <Container>
      <Typography component={"span"} variant="h3">
        Request To Book
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <Card
          sx={{ marginBottom: "10px", width: "230px", marginRight: "10px" }}
        >
          {itemDetails.images && (
            <CardMedia
              component="img"
              style={{ height: "230px", width: "230px" }}
              image={formatImagesOnRecieve(itemDetails.images)[0]}
            ></CardMedia>
          )}
        </Card>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h5">{itemDetails.title}</Typography>
          <Typography variant="body1">{itemDetails.description}</Typography>
        </div>
      </div>
      <Typography component={"span"} variant="h6">
        Chosen Dates:
      </Typography>

      <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
      <Row
        tableData={[
          { key: "Start Date:", value: requestStartDate.toDateString() },
          { key: "End Date:", value: requestEndDate.toDateString() },
        ]}
      />
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />

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
              />
              {calendarStartDate && (
                <p>start date: {calendarStartDate.toDateString()}</p> //todo: change <p>
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
          onClick={() =>
            navigate(`/bookingCompletedPage/${itemId}`, {
              state: {
                selectedStartDate: requestStartDate,
                selectedEndDate: requestEndDate,
                excludedDates,
              },
            })
          }
        >
          Confirm
        </Button>
      </div>
    </Container>
  );
};

export default RequestToBookPage;
