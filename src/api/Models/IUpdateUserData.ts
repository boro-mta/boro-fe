import IUserImageInfo from "./IUserImageInfo";

export default interface IUpdateUserData {
  about: string;
  email: string;
  latitude: number;
  longitude: number;
  image?: IUserImageInfo | null;
}
