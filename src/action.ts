import { ReactFacebookLoginInfo } from "react-facebook-login";

export const SET_USER_DATA = 'SET_USER_DATA';

export const setUserData = (userData: ReactFacebookLoginInfo) => ({
  type: SET_USER_DATA,
  payload: userData,
});

