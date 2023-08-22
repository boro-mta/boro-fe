import IUserProfile from "./Models/IUserProfile";
import IUpdateUserData from "./Models/IUpdateUserData";
import { HttpOperation, requestAsync } from "./BoroWebServiceClient";
import IUserImageInfo from "./Models/IUserImageInfo";
import ILocationDetails from "./Models/ILocationDetails";
import { IInputImage } from "../types";
import IUserStatistics from "./Models/IUserStatistics";

export const getUserProfile = async (
  userId: string | "me"
): Promise<IUserProfile> => {
  const endpoint = `Users/${userId}/Profile`;
  const profile = (await requestAsync<IUserProfile>(
    HttpOperation.GET,
    endpoint
  )) as IUserProfile;

  return profile;
};

export const getUserLocation = async (
  userId: string | "me"
): Promise<ILocationDetails> => {
  const endpoint = `Users/${userId}/Location`;
  const location = (await requestAsync<ILocationDetails>(
    HttpOperation.GET,
    endpoint
  )) as ILocationDetails;

  return location;
};

export const getUserPicture = async (
  userId: string | "me"
): Promise<IInputImage> => {
  const endpoint = `Users/${userId}/ProfilePicture`;
  const picture = (await requestAsync<IInputImage>(
    HttpOperation.GET,
    endpoint
  )) as IInputImage;

  return picture;
};

export const updateUser = async (updateData: IUpdateUserData) => {
  const endpoint = `Users/Me/Update`;
  return (await requestAsync<string>(
    HttpOperation.POST,
    endpoint,
    updateData
  )) as string;
};

export const updateUserImage = async (updateImage: IUserImageInfo) => {
  const endpoint = `Users/Me/Update/Image`;
  return (await requestAsync<string>(
    HttpOperation.POST,
    endpoint,
    updateImage
  )) as string;
};

export const updateUserLocation = async (
  latitude: number,
  longitude: number
) => {
  const endpoint = `Users/Me/Update/Location?latitude=${latitude}&longitude=${longitude}`;
  return (await requestAsync<string>(HttpOperation.POST, endpoint)) as string;
};

export const getUserStatistics = async (
  userId: string
): Promise<IUserStatistics> => {
  const endpoint = `Users/${userId}/Statistics`;
  return (await requestAsync<IUserStatistics>(
    HttpOperation.GET,
    endpoint
  )) as IUserStatistics;
};

export const getTop10Statistics = async (
  userId: string
): Promise<IUserStatistics[]> => {
  const endpoint = `Users/Leaderboard`;
  return (await requestAsync<IUserStatistics[]>(
    HttpOperation.GET,
    endpoint
  )) as IUserStatistics[];
};
