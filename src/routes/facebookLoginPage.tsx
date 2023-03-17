import React, { useState } from "react";
import FacebookLoginButton from "../components/FacebookLogin/FacebookLogin";
import { Box } from "@mui/material";
import { ReactFacebookLoginInfo } from "react-facebook-login";
import { useNavigate } from "react-router-dom";
import { selectUserName, updateUser } from '../features/UserSlice';
import { useAppDispatch, useAppSelector } from "../app/hooks";
interface IUserData {
    name?: string,
    email?: string,
    picture?: ReactFacebookLoginInfo['picture']
};

const FacebookLoginPage = () => {

    const dispatch = useAppDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<IUserData>()
    const navigate = useNavigate();
    const userName = useAppSelector(selectUserName)
    const handleLoginSuccess = (response: ReactFacebookLoginInfo) => {
        setIsLoggedIn(true)
        //setUserData({ name: response.name, email: response.email, picture: response.picture })
    }
    return (
        <div className="facebook-login-page">
            <h1>Facebook Login</h1>
            <Box><FacebookLoginButton onLoginSuccess={handleLoginSuccess} /></Box>
        </div>
    );
};

export default FacebookLoginPage;
