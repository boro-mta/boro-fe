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
    <FacebookLogin
      appId="3157987714491555"
      autoLoad={true}
      fields="name,email,picture.width(200)"
      callback={handleFacebookResponse}
      scope="public_profile,user_friends,user_actions.books"
    />
  );
};

export default FacebookLoginButton;
