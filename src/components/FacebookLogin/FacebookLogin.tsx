import React, { Component } from 'react';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';

interface IProps {
    onLoginSuccess: (response: ReactFacebookLoginInfo) => void
}


const FacebookLoginButton = ({ onLoginSuccess }: IProps) => {


    return <FacebookLogin
        appId="3157987714491555"
        autoLoad={true}
        fields="name,email,picture"
        callback={onLoginSuccess}
    />
}

export default FacebookLoginButton;
