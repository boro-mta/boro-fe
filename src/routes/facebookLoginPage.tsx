import React, { useEffect, useState } from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import {
  selectAccessToken,
  selectPicture,
  selectUserId,
  selectUserName,
  updateAccessToken,
  updateFacebookId,
  updatePartialUser,
  updateServerAddress,
  updateUser,
  updateUserName,
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import useLocalStorage from "../hooks/useLocalStorage";
import { ICoordinate, IInputImage } from "../types";
import {
  getUserLocation,
  getUserPicture,
  getUserProfile,
} from "../api/UserService";
import { LoginWithFacebook } from "../api/BoroWebServiceClient";
import { formatImagesOnRecieve } from "../utils/imagesUtils";
import { getCurrentUserId } from "../utils/authUtils";

const FacebookLoginPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLoginSuccess = (response: ReactFacebookLoginInfo) => {
    const pictureUrl =
      response.picture && response.picture.data && response.picture.data.url;

    console.log(response);

    dispatch(
      updateUser({
        name: response.name || "",
        email: response.email || "",
        facebookId: response.id,
        accessToken: response.accessToken,
        picture: "",
        serverAddress: { latitude: 0, longitude: 0 },
        currentAddress: { latitude: 0, longitude: 0 },
        userId: "",
      })
    );

    const userFacebookLoginDetails = {
      accessToken: response.accessToken,
      facebookId: response.userID,
    };

    backendFacebookAuthentication(
      userFacebookLoginDetails,
      response,
      pictureUrl
    );
  };

  const backendFacebookAuthentication = async (
    userFacebookLoginDetails: any,
    response: ReactFacebookLoginInfo,
    pictureUrl: any
  ) => {
    const backendResponse = await LoginWithFacebook(
      userFacebookLoginDetails.accessToken,
      userFacebookLoginDetails.facebookId
    );


    dispatch(updateAccessToken(response.accessToken));
    dispatch(updateFacebookId(response.userID));
    dispatch(updateUserName(response.name || ""));
    console.log(response);

    if (backendResponse.firstLogin == true) {
      dispatch(
        updatePartialUser({
          picture: pictureUrl,
          userId: backendResponse.userId,
        })
      );
      navigate("/newUser");
    } else {
      const userHomeLocation = await getUserLocation(backendResponse.userId);
      const userProfile = await getUserProfile(backendResponse.userId);
      dispatch(
        updateUser({
          name: userProfile.firstName + " " + userProfile.lastName || "",
          email: response.email || "",
          facebookId: response.id,
          accessToken: response.accessToken,
          picture:
            formatImagesOnRecieve([userProfile.image as IInputImage])[0] || "",
          serverAddress: {
            latitude: userProfile.latitude,
            longitude: userProfile.longitude,
          },
          currentAddress: { latitude: 0, longitude: 0 },
          userId: userProfile.userId,
        })
      );

      updateServerAddress({
        latitude: userHomeLocation.latitude,
        longitude: userHomeLocation.longitude,
      });
      navigate(`/`);
    }
  };
  const userid = getCurrentUserId();
  useEffect(() => {
    if (userid != null) {
      console.log(userid);
      console.log("Redirecting...");
      navigate(`/`);
    }
  });

  return (
    <div className="facebook-login-page">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="top"
        minHeight="100vh"
      >
        <h3>We Are Happy To See You Are Using Boro!</h3>
        <h4>Continue By Logging In</h4>
        <FacebookLoginButton onLoginSuccess={handleLoginSuccess} />
      </Box>
    </div>
  );
};

export default FacebookLoginPage;
