import React, { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router";
import {
  IFullItemDetailsNew,
  IInputImage,
  IReservationDetails,
} from "../types";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getItem } from "../api/ItemService";

import { getReservation } from "../api/ReservationService";
import { getUserPicture, getUserProfile } from "../api/UserService";
import { isCurrentUser } from "../utils/authUtils";
import IUserProfile from "../api/Models/IUserProfile";
import {
  IReservationStatusInfo,
  generateReservationStatusInfo,
  statusFromNumToString,
} from "../utils/reservationsUtils";
import MinimizedUserDetails from "../components/MinimizedUserDetails/MinimizedUserDetails";
"@sendbird/uikit-react/react/";
type IReservationDetailsParams = {
  reservationId: string;
};

import PointsContainer from "../components/PointsContainer/PointsContainer";
import DateRangeSummary from "../components/DateRangeSummary/DateRangeSummary";
import ContactUserButton from "../components/Chat/ContactUserButton";
import ReservationStatusChip from "../components/ReservationStatusChip/ReservationStatusChip";

type Props = {};

const ReservationDetailsPage = ({}: Props) => {
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

  const [userDetails, setUserDetails] = useState<IUserProfile>({
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
  const [isCurrentUserLender, setIsCurrentUserLender] = useState<boolean>(
    false
  );
  const [userFullName, setUserFullName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  let itemServerDetails: IFullItemDetailsNew;

  const navigate = useNavigate();

  const [reservationStatusInfo, setReservationStatusInfo] = useState<
    IReservationStatusInfo
  >({
    title: "",
    description: "",
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
        }
      }
    };

    getReservationDetails();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (borrowerId.length > 0 && lenderId.length > 0) {
        let x = isCurrentUser(lenderId);
        setIsCurrentUserLender(x);
        setReservationStatusInfo(
          generateReservationStatusInfo(reservationDetails.status, x)
        );

        const personServerDetails: IUserProfile = (await getUserProfile(
          x ? borrowerId : lenderId
        )) as IUserProfile;

        if (personServerDetails) {
          setUserDetails(personServerDetails);

          const serverProfilePicture = await getUserPicture(
            personServerDetails.userId
          );
          setUserProfilePicture(serverProfilePicture);

          let fullName: string = personServerDetails.firstName.concat(
            " " + personServerDetails.lastName
          );
          setUserFullName(fullName);
          setUserId(personServerDetails.userId);
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

  const HeaderContainer = () => (
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
      <Typography component={"span"} variant="h4">
        Reservation Summary
      </Typography>
    </Paper>
  );
  const ItemInfoContainer = () => (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        maxHeight: 150,
        flexGrow: 1,
        display: "flex",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <ButtonBase
        onClick={handleItemPictureClicked}
        sx={{
          maxWidth: 128,
          maxHeight: 128,
        }}
      >
        {itemDetails.images && (
          <Img
            alt="complex"
            src={formatImagesOnRecieve(itemDetails.images)[0]}
          />
        )}
      </ButtonBase>
      <Box>
        <Typography gutterBottom variant="h5">
          {itemDetails.title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {itemDetails.description}
        </Typography>
        {isCurrentUserLender && (
          <PointsContainer title={"Earn 500 points by lending this item "} />
        )}
        {!isCurrentUserLender && (
          <PointsContainer title={"Earn 300 points by borrowing this item "} />
        )}
      </Box>
    </Paper>
  );
  const StatusMessage = () => (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Typography component={"span"} variant="h6">
        {reservationStatusInfo.title}
      </Typography>
      <Typography variant="body1">
        {reservationStatusInfo.description}
      </Typography>
    </Paper>
  );
  const ReservationInfo = () => (
    <Paper
      sx={{
        p: 2,
        margin: "auto",
        marginBottom: 1,
        maxWidth: 500,
        flexGrow: 1,
        // display: "flex",
        // justifyContent: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6">Status: </Typography>
        <ReservationStatusChip reservationStatus={reservationDetails.status} />
      </Box>
      {reservationDetails.startDate && reservationDetails.endDate && (
        <DateRangeSummary
          startDate={new Date(reservationDetails.startDate)}
          endDate={new Date(reservationDetails.endDate)}
        />
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6">Actions: </Typography>
        {reservationStatusInfo.components.length > 0 &&
          reservationStatusInfo.components.map((ActionComponent, i) => (
            <ActionComponent
              key={i}
              reservationId={reservationId}
              partyId={userDetails.userId}
              itemName={itemDetails.title}
            />
          ))}
      </Box>
    </Paper>
  );
  const UserInfo = () => (
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
      {userProfilePicture.base64ImageData !== "" && userDetails && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <MinimizedUserDetails
            userId={userId}
            userFullName={userFullName}
            profilePictureData={formatImagesOnRecieve([userProfilePicture])[0]}
          />
          <ContactUserButton
            recepientUserId={userId}
            templateMessage={
              isCurrentUserLender
                ? `I saw you have requested to book my item. Let's chat.`
                : `I have a question about ${itemDetails.title}.`
            }
            afterSendHandler={() => navigate("/chat")}
            alternativeCaption={
              isCurrentUserLender ? "Contact Borrower" : "Contact Lender"
            }
          />
        </Box>
      )}
    </Paper>
  );

  return (
    <Container sx={{ alignItems: "center", alignContent: "center" }}>
      <HeaderContainer />
      <ItemInfoContainer />
      <StatusMessage />
      <ReservationInfo />
      <UserInfo />
    </Container>
  );
};

export default ReservationDetailsPage;
