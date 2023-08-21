import React, { useState, useRef, useEffect } from "react";
import { Container } from "@mui/system";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  styled,
  ButtonBase,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  IFullItemDetailsNew,
  IInputImage,
  IReservationDetails,
} from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getItem } from "../api/ItemService";

import { getReservation } from "../api/ReservationService";
import { getUserPicture, getUserProfile } from "../api/UserService";
import DateContainer from "../components/DateContainer/DateContainer";
import { isCurrentUser } from "../utils/authUtils";
import IUserProfile from "../api/Models/IUserProfile";
import {
  IBodyStatus,
  getBodyByStatus,
  statusFromNumToString,
} from "../utils/reservationsUtils";
import MinimizedUserDetails from "../components/Dashboard/MinimizedUserDetails/MinimizedUserDetails";
"@sendbird/uikit-react/react/";
type IReservationDetailsParams = {
  reservationId: string;
};

import ChatIcon from "@mui/icons-material/Chat";
import { startChat } from "../api/ChatService";
import PointsContainer from "../components/PointsContainer/PointsContainer";

type Props = {};

const ReservationDetailsPage = (props: Props) => {
  const [reservationDetails, setReservationDetails] = useState<
    IReservationDetails
  >({
    reservationId: "",
    itemId: "",
    borrowerId: "",
    lenderId: "",
    startDate: "",
    endDate: "",
    status: 0,
  });

  const [itemDetails, setItemDetails] = useState<IFullItemDetailsNew>({
    categories: [],
    condition: "",
    itemId: "",
    title: "",
    images: [],
    description: "",
    excludedDates: [],
  });

  const [relevantPersonDetails, setRelevantPersonDetails] = useState<
    IUserProfile
  >({
    firstName: "",
    lastName: "",
    facebookId: "",
    userId: "",
    email: "",
    image: {
      imageId: "",
      base64ImageData: "",
      base64ImageMetaData: "",
    },
    dateJoined: "",
    longitude: 0,
    latitude: 0,
    about: "",
  });

  let { reservationId } = useParams<IReservationDetailsParams>();

  const [serverRequestError, setServerRequestError] = useState<any>();
  const [isLender, setIsLender] = useState<boolean>(false);
  const [relevantPersonFullName, setRelevantPersonFullName] = useState<string>(
    ""
  );
  const [relevantPersonId, setRelevantPersonId] = useState<string>("");

  let itemServerDetails: IFullItemDetailsNew;

  const navigate = useNavigate();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const [relevantComponentDetails, setRelevantComponentDetails] = useState<
    IBodyStatus
  >({
    title: "",
    descroption: "",
    components: [],
  });

  const [userProfilePicture, setUserProfilePicture] = useState<IInputImage>({
    base64ImageData: "",
    base64ImageMetaData: "",
  });

  const [borrowerId, setBorrowerId] = useState<string>("");
  const [lenderId, setLenderId] = useState<string>("");

  useEffect(() => {
    const getReservationDetails = async () => {
      let reservationDetails: IReservationDetails;
      if (reservationId) {
        try {
          reservationDetails = (await getReservation(
            reservationId
          )) as IReservationDetails;
          setReservationDetails(reservationDetails);
          const reservationItemId = reservationDetails.itemId;
          setLenderId(reservationDetails.lenderId);
          setBorrowerId(reservationDetails.borrowerId);

          itemServerDetails = (await getItem(
            reservationItemId
          )) as IFullItemDetailsNew;
          setItemDetails(itemServerDetails);
        } catch (err) {
          console.log("Error while loading reservation");
          setServerRequestError(err);
          //todo:show error
        }
      }
    };

    getReservationDetails();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (borrowerId.length > 0 && lenderId.length > 0) {
        let x = isCurrentUser(lenderId);
        setIsLender(x);
        setRelevantComponentDetails(
          getBodyByStatus(reservationDetails.status, x)
        );

        const personServerDetails: IUserProfile = (await getUserProfile(
          x ? borrowerId : lenderId
        )) as IUserProfile;

        if (personServerDetails) {
          setRelevantPersonDetails(personServerDetails);

          const serverProfilePicture = await getUserPicture(
            personServerDetails.userId
          );
          setUserProfilePicture(serverProfilePicture);

          let fullName: string = personServerDetails.firstName.concat(
            " " + personServerDetails.lastName
          );
          setRelevantPersonFullName(fullName);
          setRelevantPersonId(personServerDetails.userId);
        }
      }
    };
    fetchUserDetails();
  }, [borrowerId, lenderId]);

  console.log(reservationDetails);

  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });

  const handleItemPictureClicked = () => {
    navigate(`/Item/${reservationDetails.itemId}`);
  };

  const handleBackClicked = () => {
    if (isLender) {
      navigate(`/lenderDashboard`);
    } else {
      navigate(`/borrowerDashboard`);
    }
  };

  const handleStartChat = () => {
    const openNewChat = async () => {
      await startChat(
        relevantPersonId,
        isLender
          ? `I saw you have requested to book my item. Let's chat.`
          : `I have a question about ${itemDetails.title}.`
      );
    };
    openNewChat();
    navigate("/chat");
  };

  return (
    <Container>
      <Typography component={"span"} variant="h3">
        Reservation Details Page
      </Typography>

      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Typography component={"span"} variant="h6">
          {relevantComponentDetails.title}
        </Typography>
        <Typography variant="body1">
          {relevantComponentDetails.descroption}
        </Typography>
      </Paper>

      <br></br>

      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase
              onClick={handleItemPictureClicked}
              sx={{ width: 128, height: 128 }}
            >
              {itemDetails.images && (
                <Img
                  alt="complex"
                  src={formatImagesOnRecieve(itemDetails.images)[0]}
                />
              )}
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {itemDetails.title}
                </Typography>
                {isLender && (
                  <Grid item>
                    <PointsContainer title={"Amount of points you get by lending this item:: "} points={500} />
                  </Grid>
                )}
                <Typography variant="body2" gutterBottom>
                  {itemDetails.description}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  Dates:{""}
                </Typography>

                {reservationDetails.startDate && reservationDetails.endDate && (
                  <Typography variant="body2">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <DateContainer
                        date={new Date(reservationDetails.startDate)}
                      />
                      <DateContainer
                        date={new Date(reservationDetails.endDate)}
                      />
                    </div>
                  </Typography>
                )}
                <Typography variant="body2" gutterBottom>
                  {""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Request Status:{" "}
                  {statusFromNumToString(reservationDetails.status)}
                </Typography>
              </Grid>
              <Grid item>
                {relevantComponentDetails.components.length > 0 && (
                  <Typography variant="body2">
                    {relevantComponentDetails.components.map(
                      (ActionComponent, i) => (
                        <ActionComponent
                          key={i}
                          reservationId={reservationId}
                          partyId={relevantPersonDetails.userId}
                          itemName={itemDetails.title}
                        />
                      )
                    )}
                  </Typography>
                )}
              </Grid>
              <Grid item>
                {!isLender && (
                  <Typography variant="body2" sx={{ marginBottom: "5px" }}>
                    The lender:{" "}
                  </Typography>
                )}
                {isLender && (
                  <Typography variant="body2" sx={{ marginBottom: "5px" }}>
                    The borrower:{" "}
                  </Typography>
                )}
                {userProfilePicture.base64ImageData !== "" &&
                  relevantPersonDetails && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MinimizedUserDetails
                        fullName={relevantPersonFullName}
                        profileImg={
                          formatImagesOnRecieve([userProfilePicture])[0]
                        }
                        partyId={relevantPersonDetails.userId}
                      />
                      <Box
                        onClick={handleStartChat}
                        sx={{ marginLeft: "10px", cursor: "pointer" }}
                      >
                        <ChatIcon />
                      </Box>
                    </div>
                  )}
              </Grid>

            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* {!isLender && (
            <Grid item xs={12}>
              <Item>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="Are-you-sure-title"
                  aria-describedby="Are-you-sure-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to cancel this reservation?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="Are-you-sure-description">
                      Choosing Yes will delete this reservation from your reservation list forever.
                      Delete the reservation?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleClose} autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </Item>
            </Grid>
          )} */}

      <Button
        variant="contained"
        sx={{ mt: 1, mr: 1 }}
        onClick={handleBackClicked}
      >
        Back
      </Button>
    </Container>
  );
};

export default ReservationDetailsPage;
