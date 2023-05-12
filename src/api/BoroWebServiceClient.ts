import apiConfig from "../config/apiConfig";
import IUserLoginResults from "./Models/IUserLoginResults";
import ITokenInfo from "./Models/ITokenInfo";

export enum HttpOperation {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

class BoroWebServiceClient {
  private readonly webServiceUrl: string;
  private readonly AuthTokenKey: string;
  private readonly AuthTokenExpirationKey: string;
  private readonly defaultHeaders: object;

  constructor() {
    this.webServiceUrl = apiConfig.SERVER_URL + ":" + apiConfig.SERVER_PORT;
    this.AuthTokenKey = apiConfig.AUTH_TOKEN_KEY;
    this.AuthTokenExpirationKey = apiConfig.AUTH_TOKEN_EXPIRATION_KEY;
    this.defaultHeaders = apiConfig.HEADERS;

    // Check token expiration every 5 minutes
    setInterval(() => {
      this.refreshTokenIfExpiresIn(10 * 60);
    }, 5 * 60 * 1000);
  }

  private refreshTokenIfExpiresIn(seconds: number = 300) {
    const tokenInfo = this.getTokenInfo();
    if (!tokenInfo) {
      console.log("token info is null");
      return;
    }

    if (tokenInfo.token == null || tokenInfo.token === "") {
      console.log(
        "current token is either null or empty. Can't refresh a token that doesn't exist."
      );
      return;
    }
    let expirationTime;
    if (tokenInfo && tokenInfo.expirationTime)
      expirationTime = tokenInfo.expirationTime.getTime();
    else expirationTime = Date.now();
    const now = Date.now();
    console.log(
      `expiration time is: ${new Date(
        expirationTime
      )}UTC. Which is ${expirationTime - now}seconds from now.`
    );

    if (now + seconds >= expirationTime) {
      console.log(
        `Token will expire in the next ${seconds}seconds. Refreshing token.`
      );
      this.refreshToken();
    }
  }

  private updateTokenInLocalStorage(tokenInfo: ITokenInfo): void {
    let expiration = "";
    if (tokenInfo && tokenInfo.expirationTime) {
      expiration = tokenInfo.expirationTime.toISOString();
    }
    localStorage.setItem(this.AuthTokenKey, tokenInfo.token);
    localStorage.setItem(this.AuthTokenExpirationKey, expiration);
  }

  private getTokenInfo(): ITokenInfo {
    let token = localStorage.getItem(this.AuthTokenKey);
    if (!token) {
      token = "";
    }
    let expirationTimeString = localStorage.getItem(
      this.AuthTokenExpirationKey
    );
    if (!expirationTimeString) {
      expirationTimeString = "";
    }

    let expirationTime =
      expirationTimeString != ""
        ? new Date(expirationTimeString)
        : new Date(Date.now());

    const tokenInfo: ITokenInfo = {
      token: token,
      expirationTime: expirationTime,
    };
    return tokenInfo;
  }

  private async refreshToken(): Promise<void> {
    const token = this.getTokenInfo();
    const headers = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token.token}`,
    };
    const refreshTokenResponse = await fetch(
      `${this.webServiceUrl}/Identity/RefreshToken`,
      {
        method: HttpOperation.POST,
        headers: headers,
      }
    );
    const tokenInfo: ITokenInfo = await refreshTokenResponse.json();
    this.updateTokenInLocalStorage(tokenInfo);
  }

  public async request<T>(
    method: HttpOperation,
    endpointPath: string,
    body?: any
  ): Promise<T> {
    this.refreshTokenIfExpiresIn();
    const tokenInfo = this.getTokenInfo();
    const headers = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${tokenInfo.token}`,
    };
    const url = `${this.webServiceUrl}/${endpointPath}`;
    const fetchConfig: RequestInit = {
      method,
      headers,
      body: JSON.stringify(body),
    };
    try {
      const response: Response = await fetch(url, fetchConfig);

      if (response.status !== 200) {
        throw new Error(`Requeset failed. ${response}`);
      }
      const responseData: T = await response.json();

      return responseData;
    } catch (error) {
      console.error(
        `An error occurred while trying to execute a request to url: [${url}] with the following configuration: [${fetchConfig}]`
      );
      console.error(error);
      throw error;
    }
  }

  public async loginWithFacebook(
    accessToken: string,
    facebookId: string
  ): Promise<IUserLoginResults> {
    const endpoint = `${this.webServiceUrl}/Identity/LoginWithFacebook?accessToken=${accessToken}&facebookId=${facebookId}`;
    const method = HttpOperation.POST;
    const headers = { ...this.defaultHeaders };

    try {
      const fetchConfig: RequestInit = {
        method: method,
        headers: headers,
      };
      console.log(fetchConfig);

      const response = await fetch(endpoint, fetchConfig);
      const loginResponse: IUserLoginResults = await response.json();
      const tokenDetails: ITokenInfo = {
        ...loginResponse.tokenDetails,
        expirationTime: new Date(loginResponse.tokenDetails.expirationTime),
      };
      this.updateTokenInLocalStorage(tokenDetails);

      return { ...loginResponse, tokenDetails: tokenDetails };
    } catch (error) {
      console.log(
        `LoginWithFacebook failed. endpoint: ${endpoint}, headers: ${headers}`
      );
      console.error(error);
      throw error;
    }
  }
}

const BoroWSClient = new BoroWebServiceClient();
export default BoroWSClient;
export const LoginWithFacebook = async (
  accessToken: string,
  facebookId: string
): Promise<IUserLoginResults> => {
  return await BoroWSClient.loginWithFacebook(accessToken, facebookId);
};
