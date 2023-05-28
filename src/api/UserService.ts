import IUserProfile from "./Models/IUserProfile";
import IUpdateUserData from "./Models/IUpdateUserData";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";
import IUserImageInfo from "./Models/IUserImageInfo";

export const getUserProfile = async (
  userId: string | "me"
): Promise<IUserProfile> => {
  console.log("getUserProfile - entry with " + userId);
  const endpoint = `Users/${userId}/Profile`;
  const profile = (await BoroWSClient.request<IUserProfile>(
    HttpOperation.GET,
    endpoint
  )) as IUserProfile;

  return profile;
};

export const updateUser = async (updateData: IUpdateUserData) => {
  console.log("updateUser - entry");
  const endpoint = `Users/Me/Update`;
  return await BoroWSClient.request<string>(HttpOperation.POST, endpoint, updateData) as string;
};

export const updateUserImage = async (updateImage: IUserImageInfo) => {
  console.log("updateImage - entry");
  const endpoint = `Users/Me/Update/Image`;
  return await BoroWSClient.request<string>(HttpOperation.POST, endpoint, updateImage) as string;
}
