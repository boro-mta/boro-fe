import { Avatar, Container } from "@mui/material";
import React from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";

interface IProps {
  onLoginSuccess: (response: ReactFacebookLoginInfo) => void;
}

const FacebookLoginButton = ({ onLoginSuccess }: IProps) => {

  const handleFacebookResponse = (response: ReactFacebookLoginInfo) => {
    onLoginSuccess(response);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'top',
        minHeight: '100vh',
      }}
    >
      <Avatar
        alt="User Avatar"
        src={""}
        sx={{
          width: 100,
          height: 100,
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Gray background
          color: 'white',
          fontSize: '2rem',
          marginBottom: 2,
        }}
      >

      </Avatar>
      <FacebookLogin
        appId="3157987714491555"
        autoLoad={false}
        fields="name,email,picture.width(200)"
        callback={handleFacebookResponse}
        scope="public_profile,user_friends"
        disableMobileRedirect={true}
      />
    </Container>
  );
};

export default FacebookLoginButton;
