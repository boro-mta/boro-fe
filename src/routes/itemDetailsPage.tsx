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
  List,
  ListItem,
  ListItemText,
  Modal,
  Slide,
  Typography,
  styled,
  Card,
  Paper,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import {
  checkExcludeDatesArrayContainsDate,
  getFormattedDate,
} from "../utils/calendarUtils";
import ErrorIcon from "@mui/icons-material/Error";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { isCurrentUser, isLoggedIn } from "../utils/authUtils";
import { getItem } from "../api/ItemService";
import {
  blockDates,
  unBlockDates,
  getItemBlockedDates,
} from "../api/ReservationService";
import { getUserProfile } from "../api/UserService";
import ILocationDetails from "../api/Models/ILocationDetails";
import { getReadableAddressAsync } from "../utils/locationUtils";
import { IItemResponse } from "../api/Models/IItemResponse";
import PointsContainer from "../components/PointsContainer/PointsContainer";
import LocationLabel from "../components/LocationLabel/LocationLabel";
import { useAppSelector } from "../app/hooks";
import MinimizedUserDetails from "../components/MinimizedUserDetails/MinimizedUserDetails";
import IUserProfile from "../api/Models/IUserProfile";
import ContactUserButton from "../components/Chat/ContactUserButton";
import OpenReserveButton from "../components/ItemDetailsTable/OpenReserveButton/OpenReserveButton";
import DatesContainer from "../components/DatesContainer/DatesContainer";

type IFullItemDetailsParams = {
  itemId: string;
};

type Props = {};

const itemDetailsPage = (props: Props) => {
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState<IItemResponse>({
    id: "",
    title: "",
    description: "",
    images: [],
    ownerId: "",
    categories: [],
    condition: "",
    latitude: 0,
    longitude: 0,
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
  };

  const handleBlockDates = async () => {
    if (itemId) {
      let datesToBlockStringFormat: string[] = getDatesInStringArr(
        manageStartDate,
        manageEndDate
      );
      await blockDates(datesToBlockStringFormat, itemId);
    } else {
      console.log("there is no itemId");
    }

    window.location.reload();
  };

  const handleUnBlockDates = async () => {
    if (itemId) {
      let datesToUnBlock: string[] = getDatesInStringArr(
        manageStartDate,
        manageEndDate
      );
      await unBlockDates(datesToUnBlock, itemId);
    } else {
      console.log("there is no itemId");
    }

    window.location.reload();
  };

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
  };

  const handleOpenModal = () => setOpen(true);

  const [openDialog, setOpennDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpennDialog(true);
  };

  const handleClose = () => {
    setOpennDialog(false);
  };

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const [dense, setDense] = React.useState(false);
  const [ownerDetails, setOwnerDetails] = useState<IUserProfile>();
  const [ownerFullName, setOwnerFullName] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [serverItemLocation, setServerItemLocation] = useState<
    ILocationDetails
  >();

  useEffect(() => {
    const getFullDetails = async () => {
      if (!itemId) {
        return;
      }

      const fullDetails: IItemResponse = (await getItem(
        itemId
      )) as IItemResponse;

      const toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 3);

      const blockedDatesServer: Date[] = await getItemBlockedDates(
        itemId,
        new Date().toISOString(),
        toDate.toISOString()
      );

      setExcludedDates(blockedDatesServer);
      setBlockedDatesToHighlight([
        {
          "react-datepicker__day--highlighted-custom-1": blockedDatesServer,
        },
      ]);

      setIsOwner(isCurrentUser(fullDetails.ownerId));

      if (fullDetails && Object.keys(fullDetails).length > 0) {
        setItemDetails(fullDetails);
        setServerItemLocation({
          latitude: fullDetails.latitude,
          longitude: fullDetails.longitude,
        });

        if (fullDetails.ownerId) {
          const serverLenderDetails: IUserProfile = await getUserProfile(
            fullDetails.ownerId
          );
          if (
            serverLenderDetails &&
            serverLenderDetails.firstName &&
            serverLenderDetails.lastName
          ) {
            setOwnerDetails(serverLenderDetails);
            setOwnerFullName(
              `${serverLenderDetails.firstName} ${serverLenderDetails.lastName}`
            );
          }
        }
      }
    };

    getFullDetails();
  }, []);

  useEffect(() => {
    const getItemAddress = async () => {
      if (
        serverItemLocation &&
        serverItemLocation.latitude != 0 &&
        serverItemLocation.longitude != 0
      ) {
        const a = await getReadableAddressAsync({
          latitude: serverItemLocation.latitude,
          longitude: serverItemLocation.longitude,
        });
      }
    };

    getItemAddress();
  }, [serverItemLocation]);

  const [checked, setChecked] = React.useState(false);

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };

  const scrollPageDown = () => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollPageDown();
  }, [checked]);

  const myCurrentLocation = useAppSelector(
    (state) => state.user.currentAddress
  );
  const userIsLoggedIn = isLoggedIn();

  const HeaderContainer = () => (
    <Paper
      sx={{
        p: 2,
        marginBottom: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        gap: 1,
      }}
    >
      <Typography variant="h3">{itemDetails.title}</Typography>

      {itemDetails.latitude !== 0 && itemDetails.longitude !== 0 && (
        <LocationLabel
          itemLocation={{
            latitude: itemDetails.latitude,
            longitude: itemDetails.longitude,
          }}
          userLocation={myCurrentLocation}
        />
      )}
    </Paper>
  );
  const ImagesContainer = () => (
    <Card sx={{ marginBottom: "10px" }}>
      {itemDetails.images && (
        <CardMedia component="div" style={{ height: "230px" }}>
          <ImagesCarousel images={formatImagesOnRecieve(itemDetails.images)} />
        </CardMedia>
      )}
    </Card>
  );
  const UserContactContainer = () => {
    return ownerDetails && !isOwner && userIsLoggedIn ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1",
        }}
      >
        <Typography sx={{ marginRight: 1 }} variant="h6">
          Posted by:{" "}
        </Typography>
        <MinimizedUserDetails
          userId={ownerDetails.userId}
          userFullName={ownerFullName}
          profilePictureData={
            ownerDetails.image &&
            formatImagesOnRecieve([
              {
                ...ownerDetails.image,
              },
            ])[0]
          }
        />
        <ContactUserButton
          recepientUserId={ownerDetails.userId}
          templateMessage={`Hi! I have a question about ${itemDetails.title}.`}
          afterSendHandler={() => navigate("/chat")}
        />
      </Box>
    ) : (
      <></>
    );
  };
  const UserContactAndPointsContainer = () => {
    return userIsLoggedIn && !isOwner ? (
      <Paper
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "Column",
          gap: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <UserContactContainer />
        <PointsContainer title={"Earn 300 points by borrowing this item "} />
      </Paper>
    ) : (
      <></>
    );
  };
  const ItemDetailsContainer = () => (
    <Box
      sx={{
        marginTop: 1,
        display: "flex",
        flexDirection: "Column",
        gap: 1,
      }}
    >
      <Paper
        sx={{
          p: 2,
          gap: 1,
          display: "flex",
          alignItems: "left",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <InfoIcon htmlColor="blue" fontSize="large" />
        <Typography>{itemDetails.description}</Typography>
      </Paper>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "left",
          gap: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <CategoryIcon htmlColor="green" fontSize="large" />
        <Box
          sx={{
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography>
            Condition: {itemDetails.condition || "unavailable"}
          </Typography>
          <Typography>
            Categories:{" "}
            {(itemDetails &&
              itemDetails.categories.length > 0 &&
              itemDetails.categories.join(", ")) ||
              "unavailable"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
  const ManageCalendarContainer = () => {
    return isOwner ? (
      <>
        {" "}
        <Button
          startIcon={<EditIcon />}
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
          startIcon={<EditCalendarIcon />}
        >
          Manage Calendar
        </Button>
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Manage Calendar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose the dates you would like to block/unblock from your
              item calendar (pink dates are your blocked dates):
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
            {
              <>
                {" "}
                <Button
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
    ) : (
      <></>
    );
  };
  const ReserveContainer = () => {
    return !isOwner && userIsLoggedIn ? (
      <Box>
        <OpenReserveButton onClick={handleCheck} />

        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={handleChangeDates}
                datesToExclude={excludedDates}
                datesToHighlight={[]}
              />
              <br />
              {manageStartDate && manageEndDate && (
                <DatesContainer startDate={startDate} endDate={endDate} />
              )}
              <br />
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
                  navigate(`/requestToBook/${itemId}`, {
                    state: {
                      selectedStartDate: startDate,
                      selectedEndDate: endDate,
                      excludedDates: excludedDates,
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
          </div>
        </Slide>
      </Box>
    ) : !userIsLoggedIn ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // flexDirection: "Column",
          gap: 1,
        }}
      >
        <WarningIcon htmlColor={"red"} />
        <Typography color={"red"}>Log in to reserve this item</Typography>
      </Box>
    ) : (
      <></>
    );
  };

  return (
    <Container>
      <HeaderContainer />
      <ImagesContainer />
      <UserContactAndPointsContainer />
      <ItemDetailsContainer />
      <ManageCalendarContainer />
      <ReserveContainer />
    </Container>
  );
};

export default itemDetailsPage;
