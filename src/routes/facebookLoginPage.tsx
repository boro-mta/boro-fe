import React, { useState } from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import { selectUserName, updateUser } from "../features/UserSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { LoginWithFacebook } from "../api/BoroWebServiceClient";

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
        name: response.name,
        email: response.email,
        id: response.id,
        accessToken: response.accessToken,
        picture: pictureUrl || "",
      })
    );

    const userFacebookLoginDetails = {
      accessToken: response.accessToken,
      facebookId: response.userID,
    };
    const backendFacebookAuthentication = async (
      userFacebookLoginDetails: any
    ) => {
      const loginResponse = await LoginWithFacebook(
        userFacebookLoginDetails.accessToken,
        userFacebookLoginDetails.facebookId
      );

      console.log(loginResponse);
      if (loginResponse.firstLogin === true) {
        navigate("/newUser");
      } else {
        dispatch(
          updateUser({
            picture: pictureUrl || "",
            guid: loginResponse.userId,
          })
        );
      }
    };
    const backendResponse = backendFacebookAuthentication(
      userFacebookLoginDetails
    );

    navigate("/");
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
