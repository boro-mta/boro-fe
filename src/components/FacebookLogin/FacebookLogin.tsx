import React from 'react';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setUserData } from '../../action';
import { selectUserName, updateUser } from '../../features/UserSlice';

interface IProps {
    onLoginSuccess: (response: ReactFacebookLoginInfo) => void
}

const FacebookLoginButton = ({ onLoginSuccess }: IProps) => {
    const dispatch = useAppDispatch();
    const userName = useAppSelector(selectUserName)
    const handleFacebookResponse = (response: ReactFacebookLoginInfo) => {
        // Dispatch an action to save the user data to Redux store
        dispatch(setUserData(response));
        onLoginSuccess(response);
        dispatch(updateUser({
            name: response.name,
            email: response.email,
            id: response.id,
            accessToken: response.accessToken,
        }));
    };

    return <FacebookLogin
        appId="3157987714491555"
        autoLoad={true}
        fields="name,email,picture"
        callback={handleFacebookResponse}
    />
}

export default FacebookLoginButton;
