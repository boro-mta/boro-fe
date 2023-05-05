import apiConfig from "../config/apiConfig";

const request = async (route: string, params?: any, method = "GET") => {
  debugger;
  const options: any = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (params) {
    if (method === "GET") {
      // In the future when we will have get with query params:
      // route += "?" + objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params);
    }
  }

  const targetUrl = `${apiConfig.SERVER_URL}:${apiConfig.SERVER_PORT}/${route}`;
  console.log(targetUrl);
  const response = await fetch(targetUrl, options);
  if (response.status !== 200) {
    throw new Error(`${response.status}: ${response.statusText}`);
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

const get = (route: string, params?: any) => {
  return request(route, params);
};

const create = (route: string, params: any) => {
  return request(route, params, "POST");
};

const update = (route: string, params: any) => {
  return request(route, params, "PUT");
};

const remove = (route: string, params: any) => {
  return request(route, params, "DELETE");
};

export default {
  get,
  create,
  update,
  remove,
};
