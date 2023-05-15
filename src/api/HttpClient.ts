import apiConfig from "../config/apiConfig";

const request = async (route: string, params?: any, method = "GET") => {
const request = async (
  route: string,
  queryParams?: any,
  bodyParams?: any,
  method = "GET"
) => {
  const options: any = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (queryParams && Object.keys(queryParams).length > 0) {
    route += "?" + objectToQueryString(queryParams);
  }
  if (bodyParams && Object.keys(bodyParams).length > 0) {
    options.body = JSON.stringify(bodyParams);
  }

  const targetUrl = `${apiConfig.SERVER_URL}:${apiConfig.SERVER_PORT}/${route}`;
  console.log(targetUrl);
  const response = await fetch(targetUrl, options);
  if (response.status !== 200) {
    console.log(`${response.status}: ${response.statusText}`);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    try {
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err);
    }
  } else {
    return response;
  }
};

const objectToQueryString = (obj: any) => {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
};

const get = (route: string, queryParams?: any, bodyParams?: any) => {
  return request(route, queryParams, bodyParams);
};

const create = (route: string, queryParams?: any, bodyParams?: any) => {
  return request(route, queryParams, bodyParams, "POST");
};

const update = (route: string, queryParams?: any, bodyParams?: any) => {
  return request(route, queryParams, bodyParams, "PUT");
};

const remove = (route: string, queryParams?: any, bodyParams?: any) => {
  return request(route, queryParams, bodyParams, "DELETE");
};

export default {
  get,
  create,
  update,
  remove,
};
