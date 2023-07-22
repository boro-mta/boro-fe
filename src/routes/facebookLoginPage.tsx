import React, { useEffect } from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import { updatePartialUser, updateServerAddress, updateUser } from "../features/UserSlice";
import { useAppDispatch } from "../app/hooks";
import BoroWSClient from "../api/BoroWebServiceClient";
import useLocalStorage from "../hooks/useLocalStorage";
import { ICoordinate } from "../types";
import { getUserLocation } from "../api/UserService";

const FacebookLoginPage = () => {
  //Get redux dispatcher
  const dispatch = useAppDispatch();

  //Get navigation tool
  const navigate = useNavigate();

  //User's local storage
  const [userInfo, setUser] = useLocalStorage("user", "");

  //If a user exists in the local storage, load it
  useEffect(() => {
    if (userInfo != "") {
      //Parse info from local storage
      const userLocalInfo = JSON.parse(userInfo);
      console.log("Parsed info ", userLocalInfo);

      let currentLocation: ICoordinate = { latitude: 0, longitude: 0 };
      if (userLocalInfo.address && userLocalInfo.address.latitude) {
        currentLocation.latitude = userLocalInfo.address.latitude;
      }
      if (userLocalInfo.address && userLocalInfo.address.longitude) {
        currentLocation.longitude = userLocalInfo.address.longitude;
      }

      dispatch(
        updateUser({
          name: userLocalInfo.name,
          email: userLocalInfo.email,
          facebookId: userLocalInfo.facebookId,
          accessToken: userLocalInfo.accessToken,
          picture: userLocalInfo.picture,
          currentAddress: {
            longitude: currentLocation.longitude,
            latitude: currentLocation.latitude,
          },
          serverAddress: {
            //server address is not chosen yet 
            longitude: 0,
            latitude: 0,
          },
          userId: userLocalInfo.guid,
        })
      );
    }
  }, []);

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
    backendFacebookAuthentication(userFacebookLoginDetails, response, pictureUrl);
  };

  //A function used to authenticate infront of Boro's server
  const backendFacebookAuthentication = async (userFacebookLoginDetails: any, response: ReactFacebookLoginInfo, pictureUrl: any) => {
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
    let savedUser = {
      name: response.name || "",
      email: response.email || "",
      facebookId: response.id,
      accessToken: response.accessToken,
      picture: pictureUrl || "",
      guid: backendResponse.userId,
      address: {
        latitude: 0,
        longitude: 0,
      },
    };

    //Save the user to local storage
    setUser(JSON.stringify(savedUser));

    if (backendResponse.firstLogin == true) {
      //In case of a first login

      //Save the user to local storage as is
      setUser(JSON.stringify(savedUser));
      navigate("/newUser");
    } else {
      //In case of a returning user:
      //we save in the redux user's 'home' address

      const userHomeLocation = await getUserLocation(backendResponse.userId);

      //Save the user to local storage with it's 'home' address
      savedUser = {
        ...savedUser,
        address: {
          latitude: userHomeLocation.latitude,
          longitude: userHomeLocation.longitude,
        },
      };

      setUser(JSON.stringify(savedUser));

      updateServerAddress({
        latitude: userHomeLocation.latitude,
        longitude: userHomeLocation.longitude,
      })
      navigate("/");
    }
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
