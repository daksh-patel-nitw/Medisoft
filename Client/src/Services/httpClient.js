import axios from 'axios';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { getAuth } from "../redux/slices/authSlice";

const client = axios.create({
  baseURL: "http://localhost:5000",
  json: true,
});

client.interceptors.response.use(
  (response) => {
    // console.log(response.data);
    if (response.data.show === true) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error.response) {
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
      } else {
        if (error.response.data.warn === true) {
          toast.warn(error.response.data.message);
        } else
          toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
      }
      console.log("error interceptors", error.response.status);
    } else if (error.request) {
      console.error("Network error: ", error.message);
      toast.error("Network error: Unable to connect to the server. Please check your internet connection.");
    } else {
      console.error("Error: ", error.message);
      toast.error(`Unexpected error: ${error.message}`);
    }
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
      .then((response) => resolve(response))
      .catch((error) => reject(error));
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
          resolve(err.response.status);
        } else {
          reject(err);
        }
      });
  });



const executeNoTokenStatusRequest = (method, resource, data = null, params = null, headers = null, auth = false) =>
  new Promise((resolve, reject) => {
    console.log(resource);
    client({
      method,
      url: resource,
      data,
      params,
      headers,
      withCredentials: auth,
    })
      .then((req) => resolve(req.status))
      .catch((err) => {
        if ([400, 401, 402, 405, 406, 410, 500, 409, 404].includes(err.response?.status)) {
          resolve(err.response.status);
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
      toast.error('Error refreshing token.');
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

const executeFileUpload = (method, resource, fileData, params = null, headers = {}, auth = false) =>
  new Promise((resolve, reject) => {
    const formHeaders = {
      ...headers,
      'Content-Type': 'multipart/form-data',
    };

    client({
      method,
      url: resource,
      data: fileData,
      params,
      headers: formHeaders,
      withCredentials: auth,
    })
      .then((req)=>resolve(req.status))
      .catch((err) => reject(err));
  });


const httpClient = {
  execute,
  executeNoTokenRequest,
  executeRefreshToken,
  executeNoTokenStatusRequest,
  executeFileUpload,
  client,
};

export default httpClient;