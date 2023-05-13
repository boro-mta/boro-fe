import React, { useState } from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import {
  selectUserName,
  updatePartialUser,
  updateUser,
} from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import BoroWSClient from "../api/BoroWebServiceClient";

interface IUserData {
  name?: string;
  email?: string;
  picture?: ReactFacebookLoginInfo["picture"];
}

const FacebookLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userName = useAppSelector(selectUserName);

  const handleLoginSuccess = (response: ReactFacebookLoginInfo) => {
    const pictureUrl =
      response.picture && response.picture.data && response.picture.data.url;
    console.log(response);
    dispatch(
      updateUser({
        name: response.name || "",
        email: response.email || "",
        id: response.id,
        accessToken: response.accessToken,
        picture: pictureUrl || "",
        address: { latitude: 0, longitude: 0 },
        guid: "",
      })
    );

    const userFacebookLoginDetails = {
      accessToken: response.accessToken,
      facebookId: response.userID,
    };

    const backendFacebookAuthentication = async (
      userFacebookLoginDetails: any
    ) => {
      const backendResponse = await BoroWSClient.loginWithFacebook(
        userFacebookLoginDetails.accessToken,
        userFacebookLoginDetails.facebookId
      );
      console.log(backendResponse);
      if (backendResponse.firstLogin == true) {
        dispatch(
          updatePartialUser({
            picture: pictureUrl || "",
            guid: backendResponse.userId,
          })
        );
        navigate("/newUser");
      } else {
        dispatch(
          updatePartialUser({
            picture: pictureUrl || "",
            guid: backendResponse.userId,
          })
        );
      }
    };
    const backendResponse = backendFacebookAuthentication(
      userFacebookLoginDetails
    );
  };
  return (
    <div className="facebook-login-page">
      <h1>Facebook Login</h1>
      <Box>
        <FacebookLoginButton onLoginSuccess={handleLoginSuccess} />
      </Box>
    </div>
  );
};

export default FacebookLoginPage;
