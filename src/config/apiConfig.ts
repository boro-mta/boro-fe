const SERVER_URL = "https://localhost";
const SERVER_PORT = "7124";
const API_KEY = "B19489BA41AF4E2E8510637E1B717078";
const AUTH_TOKEN_KEY = "BoroAuthToken";
const AUTH_TOKEN_EXPIRATION_KEY = "BoroAuthTokenExpiration";

const HEADERS = {
  "Content-Type": "application/json",
  "x-boro-api-key": API_KEY,
};

let apiConfig = {
  SERVER_URL,
  SERVER_PORT,
  API_KEY,
  HEADERS,
  AUTH_TOKEN_KEY,
  AUTH_TOKEN_EXPIRATION_KEY,
};

export default apiConfig;
