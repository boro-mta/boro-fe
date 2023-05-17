import jwt_decode from "jwt-decode";
import apiConfig from "../config/apiConfig";

export const getCurrentToken = (): string | null => {
  const token = localStorage.getItem(apiConfig.AUTH_TOKEN_KEY);
  if (token == undefined || token == null || token === "") {
    return "";
  }
  return token;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(apiConfig.AUTH_TOKEN_KEY, token);
};

export const getCurrentUserId = (): string | null => {
  const token = getCurrentToken();
  if (token && token !== "") {
    const decodedToken = jwt_decode<{ sub: string }>(token);
    const sub = decodedToken.sub;
    return sub;
  } else {
    console.error("Token not found in local storage");
    return null;
  }
};

export const getCurrentTokenExpiration = (): Date | null => {
  const token = getCurrentToken();
  if (token && token !== "") {
    const decodedToken = jwt_decode<{ exp: number }>(token);
    const date = new Date(new Date(0).setUTCSeconds(decodedToken.exp));
    return date;
  } else {
    console.error("Token not found in local storage");
    return null;
  }
};