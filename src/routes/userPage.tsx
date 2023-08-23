import {
  Avatar,
  Box,
  Container,
  Grid,
  Typography,
  Button,
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
import ChatIcon from "@mui/icons-material/Chat";
import { startChat } from "../api/ChatService";
import { getUserItems } from "../api/ItemService";
import { useAppSelector } from "../app/hooks";
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PointsContainer from "../components/PointsContainer/PointsContainer";
import IUserStatistics from "../api/Models/IUserStatistics";

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
      // setUserPoints(calculateUserPoints(userStats));
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

  const calculateUserPoints = (userStats: any): number => {
    let points: number = 0;

    if (userStats.amountOfBorrowings != 0 || userStats.amountOfItems != 0 || userStats.amountOfBorrowings != 0) {
      points += (userStats.amountOfItems) * 100;
      points += (userStats.amountOfLendings) * 500;
      points += (userStats.amountOfBorrowings) * 300;
    }

    return points;
  }

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  const handleStartChat = () => {
    const openNewChat = async () => {
      await startChat(userId, "Hi! I have a general question.");
    };
    openNewChat();
    navigate("/chat");
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {
            <Avatar component="div" style={{ height: "150px", width: "150px" }}>
              <ImagesCarousel
                images={[
                  userProfilePicture ||
                  "https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png",
                ]}
              />
            </Avatar>
          }
        </Grid>

        <Grid item>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h5">
              {"Hi! I am " + userDetails.firstName + " " + userDetails.lastName}{" "}
            </Typography>
            <Box
              onClick={handleStartChat}
              sx={{ marginLeft: "10px", cursor: "pointer" }}
            >
              <ChatIcon />
            </Box>
          </div>
          <Typography
            variant="subtitle2"
            style={{ color: "gray" }}
            gutterBottom
          >
            {"A Boro friend since: " + formatDate(userDetails.dateJoined)}
          </Typography>
          {!isOwner && (
            <Button
              variant="outlined"
              disabled={isOwner}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
        </Grid>
      </Grid>
      <br />
      {userPoints !== -1 && (
        <Grid item>
          <PointsContainer title={"Points: "} points={userPoints} />
        </Grid>
      )}
      <br />
      <Typography variant="h5">{"About:"}</Typography>
      <Typography variant="subtitle2" style={{ color: "gray" }} gutterBottom>
        {userDetails.about}
      </Typography>
      <br />
      <Box>
        <ItemsContainer
          containerTitle={userDetails.firstName + " 's items"}
          items={userItems}
        />
      </Box>
    </Container>
  );
};

export default userPage;
