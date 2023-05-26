import { IItemImageResponse } from "./IItemImageResponse";

export default interface IUserProfile {
  userId: string;
  facebookId: string;
  firstName: string;
  lastName: string;
  about: string;
  dateJoined: string;
  email: string;
  latitude: number;
  longitude: number;
  image: IItemImageResponse;
}
