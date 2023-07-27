import apiConfig from "../config/apiConfig";
import IUserLoginResults from "./Models/IUserLoginResults";
import ITokenInfo from "./Models/ITokenInfo";
import {
  getCurrentToken,
  isLoggedIn,
  isTokenExpiringIn,
  setAuthToken,
} from "../utils/authUtils";

export enum HttpOperation {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

class BoroWebServiceClient {
  private readonly webServiceUrl: string;
  private readonly defaultHeaders: object;

  constructor() {
    this.webServiceUrl = apiConfig.SERVER_URL + ":" + apiConfig.SERVER_PORT;
    this.defaultHeaders = apiConfig.HEADERS;

    // Check token expiration every 5 minutes
    setInterval(() => {
      this.refreshTokenIfExpiresIn(10 * 60);
    }, 5 * 60 * 1000);
  }

  private async refreshTokenIfExpiresIn(
    seconds: number = 300
  ): Promise<string | null> {
    if (isLoggedIn()) {
      if (isTokenExpiringIn(seconds)) {
        console.log(
          `Token will expire in the next ${seconds}seconds. Refreshing token.`
        );
        await this.refreshToken();
      }
      return getCurrentToken();
    }
    return null;
  }

  private async refreshToken(): Promise<void> {
    const currentToken = getCurrentToken();
    if (currentToken === null || currentToken === "") {
      return;
    }
    try {
      const headers = {
        ...this.defaultHeaders,
        Authorization: `Bearer ${currentToken}`,
      };
      const refreshTokenResponse = await fetch(
        `${this.webServiceUrl}/Identity/RefreshToken`,
        {
          method: HttpOperation.POST,
          headers: headers,
        }
      );
      const tokenInfo = (await refreshTokenResponse.json()) as ITokenInfo;
      setAuthToken(tokenInfo.token);
    } catch (error) {
      console.log("couldn't refresh token");
      setAuthToken("");
    }
  }

  public async request<T>(
    method: HttpOperation,
    endpointPath: string,
    body?: any
  ) {
    try {
      const token = await this.refreshTokenIfExpiresIn();
      const headers: HeadersInit = {
        ...this.defaultHeaders,
      };
      if (token && token !== "") {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = `${this.webServiceUrl}/${endpointPath}`;

      const fetchConfig: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      };

      const response: Response = (await fetch(url, fetchConfig)) as Response;

      console.log(
        `request to ${url} returned with response status code: ${response.status}`
      );

      if (response.status !== 200) {
        throw new Error(`Requeset failed. ${response}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
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
    } catch (err) {
      console.log(err);
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
      const loginResponse = (await response.json()) as IUserLoginResults;

      setAuthToken(loginResponse.tokenDetails.token);

      return loginResponse;
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

export const requestAsync = async <T>(
  method: HttpOperation,
  endpointPath: string,
  body?: any
) => {
  return await BoroWSClient.request<T>(method, endpointPath, body);
};

export const LoginWithFacebook = async (
  accessToken: string,
  facebookId: string
): Promise<IUserLoginResults> => {
  return await BoroWSClient.loginWithFacebook(accessToken, facebookId);
};
