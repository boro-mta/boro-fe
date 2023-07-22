import {
  Box,
  Button,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  styled,
} from "@mui/material";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { IFullItemDetailsNew, IUserDetails } from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import {
  checkExcludeDatesArrayContainsDate,
  getFormattedDate,
} from "../utils/calendarUtils";
import ErrorIcon from "@mui/icons-material/Error";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { blockDates, getItem, getItemBlockedDates, unBlockDates } from "../api/ItemService";
import { getUserProfile } from "../api/UserService";
import { getCurrentUserId, isCurrentUser } from "../utils/authUtils";
import { Row } from "../components/ItemDetailsTable/ItemDetailsTable";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

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
  const [manageStartDate, setManageStartDate] = useState<Date>(new Date());
  const [manageEndDate, setManageEndDate] = useState<Date>(new Date());

  const [excludedDates, setExcludedDates] = useState<Date[]>([]);

  const [selectedDatesError, setSelectedDatesError] = useState<string>("");
  const [isValidDates, setIsValidDates] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const [imagesAsString, setImagesAsString] = useState<string[]>([]);
  const [blockedDatesToHighlight, setBlockedDatesToHighlight] = useState<any>();

  const handleChangeDates = (dates: Date[]) => {
    const [selectedStartDate, selectedEndDate] = dates;
    setStartDate(selectedStartDate);
    setEndDate(selectedEndDate);
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

  const handleChangeBlockDates = (dates: Date[]) => {
    const [selectedBlockStartDate, selectedBlockEndDate] = dates;
    setManageStartDate(selectedBlockStartDate);
    setManageEndDate(selectedBlockEndDate);
  }

  const handleBlockDates = async () => {
    if (itemId) {
      let datesToBlockStringFormat: string[] = getDatesInStringArr(manageStartDate, manageEndDate);
      await blockDates(datesToBlockStringFormat, itemId);
    }
    else {
      console.log("there is no itemId");
    }

    window.location.reload();
  }

  const handleUnBlockDates = async () => {
    if (itemId) {
      let datesToUnBlock: string[] = getDatesInStringArr(manageStartDate, manageEndDate);
      await unBlockDates(datesToUnBlock, itemId);
    }
    else {
      console.log("there is no itemId");
    }

    window.location.reload();
  }

  const getDatesInStringArr = (startDate: Date, endDate: Date): string[] => {
    let loop: Date = new Date(manageStartDate);
    let datesInStringArr: string[] = [];

    while (loop <= manageEndDate) {
      try {
        console.log(loop);
        datesInStringArr.push(loop.toISOString());
      } catch (e) {
        console.log(e);
      }

      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }

    return datesInStringArr;
  }

  //todo: put in another file
  const getDatesInDateArr = (startDate: Date, endDate: Date): Date[] => {
    let loop: Date = new Date(manageStartDate);
    let datesInDateArr: Date[] = [];

    while (loop <= manageEndDate) {
      try {
        console.log(loop);
        datesInDateArr.push(loop);
      } catch (e) {
        console.log(e);
      }

      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }

    return datesInDateArr;
  }

  const handleOpenModal = () => setOpen(true);

  const [openDialog, setOpennDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpennDialog(true);
  };

  const handleClose = () => {
    setOpennDialog(false);
  };

  const handleChange = () => {
    setOpennDialog(false);
  };

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const [dense, setDense] = React.useState(false);
  const [ownerDetails, setOwnerDetails] = useState<IUserDetails>();
  const [ownerFullName, setOwnerFullName] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    const getFullDetails = async () => {
      if (!itemId) {
        return;
      }

      const fullDetails: IFullItemDetailsNew = (await getItem(itemId)) as IFullItemDetailsNew;
      let serverLenderDetails: any;

      const today: Date = new Date();
      let toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 3);

      const blockedDatesServer: Date[] = await getItemBlockedDates(
        itemId,
        new Date().toISOString(),
        toDate.toISOString()
      );

      setExcludedDates(blockedDatesServer);
      setBlockedDatesToHighlight(
        [
          {
            "react-datepicker__day--highlighted-custom-1":
              blockedDatesServer
          },
        ]
      )

      if (fullDetails.images != undefined) {
        setImagesAsString(formatImagesOnRecieve(fullDetails.images));
      }

      setIsOwner(isCurrentUser(fullDetails.ownerId));

      if (fullDetails && Object.keys(fullDetails).length > 0) {
        setItemDetails(fullDetails);
        if (fullDetails.ownerId)
          serverLenderDetails = await getUserProfile(fullDetails.ownerId);
        setOwnerDetails(serverLenderDetails);
        if (serverLenderDetails && serverLenderDetails.firstName && serverLenderDetails.lastName) {
          let fullLenderName: string = serverLenderDetails.firstName.concat(" " + serverLenderDetails.lastName);
          setOwnerFullName(fullLenderName);
        }
      }
    };

    getFullDetails();
  }, []);

  return (
    <Container>
      <Card sx={{ marginBottom: "10px" }}>
        {itemDetails.images && (
          <CardMedia component="div" style={{ height: "230px" }}>
            <ImagesCarousel
              images={formatImagesOnRecieve(itemDetails.images)}
            />
          </CardMedia>
        )}
      </Card>
      <Typography variant="h5">{itemDetails.title}</Typography>
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
      <Typography variant="h6">About the product</Typography>
      <Typography component={"span"} variant="body1">
        {itemDetails.description}
      </Typography>

      <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
      <Row
        tableData={[
          {
            key: "Lender Name",
            value:
              ownerDetails && ownerFullName
                ?
                ownerFullName
                : "No info about the lender!",
          },
          {
            key: "About the lender",
            value:
              ownerDetails && ownerDetails.about
                ? ownerDetails.about
                : "No info about the lender!",
          },
          {
            key: "Condition",
            value: itemDetails.condition
              ? itemDetails.condition
              : "No Condition Selected!",
          },
          {
            key: "Category",
            value:
              itemDetails && itemDetails.categories.length > 0
                ? itemDetails.categories.join(", ")
                : "No Categories Selected!",
          },
        ]}
      />
      <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />

      {isOwner && <> <Button
        variant="contained"
        sx={{ mt: 1, mr: 1 }}
        onClick={() => navigate(`/editItem/${itemId}`)}
      >
        Edit Item
      </Button>

        <Button
          variant="contained"
          sx={{ mt: 1, mr: 1 }}
          onClick={handleClickOpen}
        >
          Manage Calendar
        </Button>

        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Manage Calendar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose the dates you would like to block/unblock from your item calendar
              (pink dates are your blocked dates):
            </DialogContentText>
            <DateRangePicker
              startDate={manageStartDate}
              endDate={manageEndDate}
              onChange={handleChangeBlockDates}
              datesToExclude={[]}
              datesToHighlight={blockedDatesToHighlight}
            />
            <Demo>
              <List dense={dense}>
                <ListItem>
                  {manageStartDate && (
                    <ListItemText
                      primary="Start Date:"
                      secondary={manageStartDate.toDateString()}
                    />
                  )}
                </ListItem>
                <ListItem>
                  {manageEndDate && (
                    <ListItemText
                      primary="End Date:"
                      secondary={manageEndDate.toDateString()}
                    />
                  )}
                </ListItem>
              </List>
            </Demo>
            {<> <Button
              variant="contained"
              sx={{ mt: 1, mr: 1 }}
              onClick={handleBlockDates}
              disabled={!manageEndDate}
            >
              Block
            </Button>

              <Button
                variant="contained"
                sx={{ mt: 1, mr: 1 }}
                onClick={handleUnBlockDates}
                disabled={!manageEndDate}
              >
                Unblock
              </Button>
            </>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
      </>
      }

      {!isOwner && <>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Find available dates:
        </Typography>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleChangeDates}
            datesToExclude={excludedDates}
            datesToHighlight={[]}
          />


          <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Demo>
                  <List dense={dense}>
                    <ListItem>
                      {startDate && (
                        <ListItemText
                          primary="Start Date:"
                          secondary={startDate.toDateString()}
                        />
                      )}
                    </ListItem>
                    <ListItem>
                      {endDate && (
                        <ListItemText
                          primary="End Date:"
                          secondary={endDate.toDateString()}
                        />
                      )}
                    </ListItem>
                  </List>
                </Demo>
              </Grid>
            </Grid>
          </Box>
        </div>
      </>}

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
            navigate(`/requestToBook/${itemId}`, {
              state: {
                selectedStartDate: startDate,
                selectedEndDate: endDate,
                excludedDates: itemDetails.excludedDates,
              },
            });
          }}
        >
          Reserve
        </Button>
      )}
      {isValidDates === false && (
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
      )}
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
          <Typography component={"span"} variant="body1">
            {selectedDatesError}
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default itemDetailsPage;
