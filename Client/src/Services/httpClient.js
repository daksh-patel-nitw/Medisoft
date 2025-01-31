import axios from "axios";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { getAuth } from "../slices/authSlice";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  json: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      getAuth() &&
      window.location.pathname !== "/changepassword"
    ) {
      logout();
      toast.error(error.response.data.message);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
    console.log("error interceptors", error.response.status);
    return Promise.reject(error);
  }
);

const execute = (method, resource, data = null, params = null, headers = null, auth = false) =>
  new Promise((resolve, reject) => {
    let options = {
      method,
      url: resource,
      params,
      headers: getHeaders(headers, auth),
    };
    if (data !== null) {
      options["data"] = data;
    }
    client(options)
      .then((req) => resolve(req.data))
      .catch((err) => {
        if (
          err.response?.data?.status === 403 &&
          ["Invalid token", "jwt malformed"].includes(err.response?.data?.message)
        ) {
          logout();
          window.location.href = "/";
        }
        if ([400, 401, 402, 405, 406, 410, 500, 409, 404].includes(err.response?.status)) {
          resolve(err.response.data);
        } else {
          reject(err);
        }
      });
  });

const executeNoTokenRequest = (method, resource, data = null, params = null, headers = null, auth = false) =>
  new Promise((resolve, reject) => {
    client({
      method,
      url: resource,
      data,
      params,
      headers,
      withCredentials: auth,
    })
      .then((req) => resolve(req.data))
      .catch((err) => {
        if ([400, 401, 402, 405, 406, 410, 500, 409, 404].includes(err.response?.status)) {
          resolve(err.response.data);
        } else {
          reject(err);
        }
      });
  });

  const executeRefreshToken = () => {
    return client({
      method: 'POST',
      url: '/refresh_token',
      withCredentials: true,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error refreshing token:', error);
        throw error;
      });
  };

const getHeaders = (headers, isAuth = false) => {
  const accessToken = useSelector(getAuth);
  if (isAuth) {
    return {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
      uname: `${accessToken.uname}`,
      mid: `${accessToken.mid}`,
    };
  } else {
    return {
      ...headers,
    };
  }
};

const httpClient = {
  execute,
  executeNoTokenRequest,
  executeRefreshToken,
  client,
};

export default httpClient;
