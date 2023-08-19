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
  //Get redux dispatcher
  const dispatch = useAppDispatch();

  //Get navigation tool
  const navigate = useNavigate();

  //In case of a successfull login using facebook
  const handleLoginSuccess = (response: ReactFacebookLoginInfo) => {
    //Get the url to the user's picture from facebook
    const pictureUrl =
      response.picture && response.picture.data && response.picture.data.url;

    console.log(response);

    //Send data to redux after successfull login
    dispatch(
      updateUser({
        name: response.name || "",
        email: response.email || "",
        facebookId: response.id,
        accessToken: response.accessToken,
        picture: pictureUrl || "",
        serverAddress: { latitude: 0, longitude: 0 },
        currentAddress: { latitude: 0, longitude: 0 },
        userId: "",
      })
    );

    //save the user's login details
    const userFacebookLoginDetails = {
      accessToken: response.accessToken,
      facebookId: response.userID,
    };

    //Call the function to authenticate infront of Boro's server
    backendFacebookAuthentication(
      userFacebookLoginDetails,
      response,
      pictureUrl
    );
  };

  //A function used to authenticate infront of Boro's server
  const backendFacebookAuthentication = async (
    userFacebookLoginDetails: any,
    response: ReactFacebookLoginInfo,
    pictureUrl: any
  ) => {
    //Create a user on Boro's server using facebook id and facebook access token
    const backendResponse = await LoginWithFacebook(
      userFacebookLoginDetails.accessToken,
      userFacebookLoginDetails.facebookId
    );

    //Update the user's guid after the backend response
    dispatch(
      updatePartialUser({
        picture: pictureUrl || "",
        userId: backendResponse.userId,
      })
    );
    dispatch(updateAccessToken(response.accessToken));
    dispatch(updateFacebookId(response.userID));
    dispatch(updateUserName(response.name || ""));
    console.log(response);

    if (backendResponse.firstLogin == true) {
      navigate("/newUser");
    } else {
      const userHomeLocation = await getUserLocation(backendResponse.userId);
      const userProfile = await getUserProfile(backendResponse.userId);
      dispatch(
        updateUser({
          name: userProfile.firstName || "",
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
      navigate("/");
    }
  };
  const userid = getCurrentUserId();
  useEffect(() => {
    if (userid != null) {
      console.log(userid);
      console.log("Redirecting...");
      navigate("/");
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
