import React from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import {
  updatePartialUser,
  updateUser
} from "../features/UserSlice";
import { useAppDispatch } from "../app/hooks";
import BoroWSClient from "../api/BoroWebServiceClient";
import useLocalStorage from "../hooks/useLocalStorage";

const FacebookLoginPage = () => {

  //Get redux dispatcher
  const dispatch = useAppDispatch();

  //Get navigation tool
  const navigate = useNavigate();

  //User's local storage
  const [userInfo, setUser] = useLocalStorage("user", "");

  //If a user exists in the local storage, load it
  if (userInfo != "") {
    //Parse info from local storage
    const userLocalInfo = JSON.parse(userInfo);
    console.log("Parsed info ", userLocalInfo);

    //Send local storage to redux
    dispatch(
      updateUser({
        name: userLocalInfo.name || "",
        email: userLocalInfo.email || "",
        facebookId: userLocalInfo.facebookId,
        accessToken: userLocalInfo.accessToken,
        picture: userLocalInfo.picture || "",
        address: { latitude: 0, longitude: 0 },
        userId: userLocalInfo.guid || ""
      }))
  }

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
        address: { latitude: 0, longitude: 0 },
        userId: "",
      })
    );

    //save the user's login details
    const userFacebookLoginDetails = {
      accessToken: response.accessToken,
      facebookId: response.userID,
    };

    //A function used to authenticate infront of Boro's server
    const backendFacebookAuthentication = async (
      userFacebookLoginDetails: any
    ) => {
      //Create a user on Boro's server using facebook id and facebook access token
      const backendResponse = await BoroWSClient.loginWithFacebook(
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
      console.log(backendResponse);

      //Create a user to save.
      //Consider adding a type to the savedUser
      const savedUser = {
        name: response.name || "",
        email: response.email || "",
        facebookId: response.id,
        accessToken: response.accessToken,
        picture: pictureUrl || "",
        guid: backendResponse.userId
      }

      //Save the user to local storage
      setUser(JSON.stringify(savedUser));


      if (backendResponse.firstLogin == true) {
        //In case of a first login
        navigate("/newUser");
      } else {
        //In case of a returning user
        navigate("/");
      }
    };

    //Call the function to authenticate infront of Boro's server
    backendFacebookAuthentication(userFacebookLoginDetails);

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
