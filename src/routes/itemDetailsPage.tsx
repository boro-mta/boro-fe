import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  Modal,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { allItemDetailsNew } from "../mocks/fullItemsDetails";
import { IFullItemDetailsNew } from "../types";
import HttpClient from "../api/HttpClient";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import {
  checkExcludeDatesArrayContainsDate,
  getFormattedDate,
} from "../utils/calendarUtils";
import ErrorIcon from "@mui/icons-material/Error";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
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

const itemDetailsPage = (props: Props) => {
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    categories: [],
    condition: "",
    itemId: "",
    title: "",
    images: [],
    description: "",
    excludedDates: [],
  });

  let { itemId } = useParams<IFullItemDetailsParams>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedDatesError, setSelectedDatesError] = useState<string>("");
  const [isValidDates, setIsValidDates] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const [imagesAsString, setImagesAsString] = useState<string[]>([]);

  const handleChangeDates = (dates: Date[]) => {
    const [selectedStartDate, selectedEndDate] = dates;
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
    setSelectedDatesError("");
    let loop: Date = new Date(selectedStartDate);
    if (selectedStartDate && selectedEndDate) {
      while (loop <= selectedEndDate) {
        if (
          (itemDetails.excludedDates !== undefined) && checkExcludeDatesArrayContainsDate(loop, itemDetails.excludedDates)
        ) {
          setSelectedDatesError(
            "The date " +
            getFormattedDate(loop) +
            " is not available, please choose different dates."
          );
          setIsValidDates(false);
          break;
        } else {
          setStartDate(selectedStartDate);
          setEndDate(selectedEndDate);
          setSelectedDatesError("");
          setIsValidDates(true);
        }

        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
      }
    }
  };

  const handleOpenModal = () => setOpen(true);


  useEffect(() => {
    const getFullDetails = async () => {
      let fullDetails: IFullItemDetailsNew;
      if (itemId !== undefined && itemId.length > 5) {
        fullDetails = await HttpClient.get(`items/${itemId}`);
        if (fullDetails.images != undefined) {
          setImagesAsString(formatImagesOnRecieve(fullDetails.images));
        }
      } else {
        fullDetails =
          allItemDetailsNew.find((item) => item.itemId === itemId) ||
          allItemDetailsNew[0];
      }
      setItemDetails(fullDetails);
    };

    getFullDetails();
  }, []);

  return (
    <Container>
      <Card sx={{ marginBottom: "10px" }}>
        {itemDetails.images && (
          <CardMedia component="div" style={{ height: "230px" }}>
            <ImagesCarousel images={formatImagesOnRecieve(itemDetails.images)} />
          </CardMedia>
        )}
      </Card>
      <Typography variant="h5">{itemDetails.title}</Typography>
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Typography variant="h6">About the product</Typography>
      <Typography variant="body1">{itemDetails.description}</Typography>

      <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
      <Row
        tableData={[
          { key: "Condition", value: itemDetails.condition },
          { key: "Category", value: itemDetails.categories.join(", ") },
        ]}
      />
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />

      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1 }}
        onClick={() => navigate(`/editItem/${itemId}`)}
      >
        Edit Item
      </Button>

      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Find available dates
      </Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleChangeDates}
          datesToExclude={itemDetails.excludedDates}
        />
        {startDate && (
          <p>start date: {startDate.toDateString()}</p>
        )}
        {endDate && (
          <p>end date: {endDate.toDateString()}</p>
        )}
      </div>

      {isValidDates === true && (
        <Button
          variant="contained"
          color="success"
          endIcon={<TaskAltIcon />}
          sx={{
            marginTop: "10px",
            position: "sticky",
            bottom: "10px",
            right: "2%",
            width: "96%",
          }}
          onClick={() => {
            navigate(`/requestToBookPage/${itemId}`,
              {
                state:
                {
                  selectedStartDate: startDate,
                  selectedEndDate: endDate,
                  excludedDates: itemDetails.excludedDates,
                }
              }
            )
          }}
        >
          Reserve
        </Button>
      )
      }
      {
        isValidDates === false && (
          <Button
            variant="contained"
            color="error"
            endIcon={<ErrorIcon />}
            sx={{
              marginTop: "10px",
              position: "sticky",
              bottom: "10px",
              right: "2%",
              width: "96%",
            }}
            onClick={handleOpenModal}
          >
            Invalid dates
          </Button>
        )
      }
      <Modal open={open} onClose={() => setOpen(false)}>
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
          <Typography variant="body1">{selectedDatesError}</Typography>
        </Box>
      </Modal>
    </Container >
  );
};

export default itemDetailsPage;
