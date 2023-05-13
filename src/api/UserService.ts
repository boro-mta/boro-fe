import IUserProfile from "./Models/IUserProfile";
import IUpdateUserData from "./Models/IUpdateUserData";
import BoroWSClient, { HttpOperation } from "./BoroWebServiceClient";

export const getUserProfile = async (
  userId: string | "me"
): Promise<IUserProfile> => {
  console.log("getUserProfile - entry with " + userId);
  const endpoint = `Users/${userId}/Profile`;
  const profile = (await BoroWSClient.request<IUserProfile>(
    HttpOperation.GET,
    endpoint
  )) as IUserProfile;

  return { ...profile, dateJoined: new Date(profile.dateJoined) };
};

export const updateUser = async (updateData: IUpdateUserData) => {
  console.log("updateUser - entry");
  const endpoint = `Users/Me/Update`;
  await BoroWSClient.request<void>(HttpOperation.POST, endpoint, updateData);
};
