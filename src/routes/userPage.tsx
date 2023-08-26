import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagesCarousel from "../components/ImagesCarousel/ImagesCarousel";
import { IInputImage, IUserDetails, IUserItem } from "../types";
import { allUserDetails } from "../mocks/userDetails";
import ItemsContainer from "../components/ItemsContainer/ItemsContainer";
import { getUserProfile, getUserStatistics } from "../api/UserService";
import { getCurrentUserId } from "../utils/authUtils";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getUserItems } from "../api/ItemService";
import { useAppSelector } from "../app/hooks";
import PointsContainer from "../components/PointsContainer/PointsContainer";
import IUserStatistics from "../api/Models/IUserStatistics";
import ContactUserButton from "../components/Chat/ContactUserButton";
import { BorderAll } from "@mui/icons-material";

type Props = {};

const userPage = (props: Props) => {
  const [userDetails, setUserDetails] = useState<IUserDetails>(
    allUserDetails[3]
  );

  const [userPoints, setUserPoints] = useState<number>(-1);
  const [userStats, setUserStats] = useState<IUserStatistics>();

  const [userItems, setUserItems] = useState<IUserItem[]>([]);

  const userCurrentId = getCurrentUserId();

  const [isOwner, setIsOwner] = useState(false);

  const [userProfilePicture, setUserProfilePicture] = useState("");
  const currentUrl = window.location.href;

  let userId = currentUrl.split("/").pop() as string;
  console.log("current profile user id is : ", userId);

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/users/${userId}/edit`);
  };

  useEffect(() => {
    const fetchUserItems = async () => {
      const items = await getUserItems(userId);
      items && items?.length > 0 && setUserItems(items);
    };
    fetchUserItems();
  }, [userId]);

  const currUserProfilePicture = useAppSelector((state) => state.user.picture);

  const getUserDetails = async () => {
    try {
      console.log("Getting user profile: ", userId, " from the server");

      const userProfile = await getUserProfile(userId as string);
      console.log("Got a user: ");
      console.log(userProfile);

      let userDetails: IUserDetails = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        userId: userProfile.facebookId,
        profileImage: formatImagesOnRecieve([
          userProfile.image as IInputImage,
        ])[0],
        dateJoined: userProfile.dateJoined,
        longitude: 0,
        latitude: 0,
        about: userProfile.about,
      };

      let isOwner = userCurrentId == userId;

      setIsOwner(!isOwner);

      if (isOwner && currUserProfilePicture) {
        userDetails.profileImage = userProfilePicture;
        setUserProfilePicture(currUserProfilePicture);
      } else {
        setUserProfilePicture(userDetails.profileImage);
      }

      setUserDetails(userDetails);

      const serverUserStats: IUserStatistics = await getUserStatistics(userId);
      setUserStats(serverUserStats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userCurrentId == userId && currUserProfilePicture) {
      setUserProfilePicture(currUserProfilePicture);
    }
  }, [currUserProfilePicture]);

  useEffect(() => {
    getUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!userStats) {
      return;
    }

    setUserPoints(calculateUserPoints(userStats));
  }, [userStats]);

  const calculateUserPoints = (userStats: IUserStatistics): number => {
    let points: number = 0;

    if (
      userStats.amountOfBorrowings != 0 ||
      userStats.amountOfItems != 0 ||
      userStats.amountOfBorrowings != 0
    ) {
      points += userStats.amountOfItems * 100;
      points += userStats.amountOfLendings * 500;
      points += userStats.amountOfBorrowings * 300;
    }

    return points;
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  return (
    <Container>
      <Card sx={{ maxWidth: 345, boxShadow: '-5px 4px 10px rgba(0, 10, 0, 0.2)', border: '1px solid lightgray' }}>
        <CardContent style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar component="div" style={{ height: "150px", width: "150px", marginRight: '20px' }}>
            <ImagesCarousel
              images={[
                userProfilePicture ||
                "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png",
              ]}
            />
          </Avatar>

          <div>
            <Typography variant="h5">
              {userDetails.firstName + " " + userDetails.lastName}{" "}
            </Typography>
            <Typography
              variant="subtitle2"
              style={{ color: "gray" }}
              gutterBottom
            >
              {"A Boro friend since: " + formatDate(userDetails.dateJoined)}
            </Typography>
            <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
              {userDetails.about}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <ContactUserButton
            templateMessage={"Hi! I have a general question."}
            recepientUserId={userId}
            afterSendHandler={() => navigate("/chat")}
          />
          {!isOwner && (
            <Button
              variant="outlined"
              disabled={isOwner}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
        </CardActions>
      </Card>
      <br />
      <Divider />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
        </Grid>
      </Grid>
      <br />
      {userPoints !== -1 && (
        <Grid item>
          <PointsContainer title={"Points: "} points={userPoints} />
        </Grid>
      )}
      <Box>
        <ItemsContainer
          containerTitle={userDetails.firstName + " 's items"}
          items={userItems}
        />
      </Box>
    </Container>
  );

}
export default userPage;
