import ITokenInfo from "./ITokenInfo";

export default interface IUserLoginResults {
  userId: string;
  firstLogin: boolean;
  tokenDetails: ITokenInfo;
}
