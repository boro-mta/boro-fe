export default interface IUserProfile {
  userId: string;
  facebookId: string;
  firstName: string;
  lastName: string;
  about: string;
  dateJoined: string; //should be date in the future
  email: string;
  latitude: number;
  longitude: number;
}
