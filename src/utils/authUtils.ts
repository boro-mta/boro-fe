import jwt_decode from "jwt-decode";
import apiConfig from "../config/apiConfig";
import { current } from "@reduxjs/toolkit";

export const getCurrentToken = (): string | null => {
  const token = localStorage.getItem(apiConfig.AUTH_TOKEN_KEY);
  if (token == undefined || token == null || token === "") {
    return "";
  }
  return token;
};

export const isTokenExpiringIn = (seconds: number): boolean => {
  const token = getCurrentToken();
  if (token && token !== "") {
    try {
      const decodedToken = jwt_decode<{ exp: number }>(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      const remainingTime = expirationTime - currentTime;

      return remainingTime <= seconds * 1000;
    } catch (error) {
      console.error("Invalid token:", error);
      setAuthToken("");
    }
  }
  //some error happened or invalid token
  //treated as expiring
  return true;
};

export const isLoggedIn = (): boolean => {
  return isTokenExpiringIn(30) === false;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(apiConfig.AUTH_TOKEN_KEY, token);
};

export const getCurrentUserId = (): string | null => {
  if (isLoggedIn()) {
    const token = getCurrentToken();
    if (token && token !== "") {
      try {
        const decodedToken = jwt_decode<{ sub: string }>(token);
        const sub = decodedToken.sub;
        return sub;
      } catch (error) {
        console.error("Invalid token:", error);
        setAuthToken("");
      }
    }
  }
  return null;
};

export const isCurrentUser = (userId: string | null | undefined): boolean => {
  if (userId === null || userId === undefined) {
    return false;
  }
  const current = getCurrentUserId();

  if (current) {
    return current === userId;
  }
  return false;
};
