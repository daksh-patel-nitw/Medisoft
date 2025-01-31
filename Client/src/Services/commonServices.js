import httpClient from "./httpCommon";

const header = {
  "Content-Type": "application/json",
};

const noTokenPostRequest = (url, data) => {
  return httpClient.executeNoTokenRequest(
    "post",
    url,
    data,
    null,
    header,
    false
  );
};

const getRequest = (url) => {
  return httpClient.execute("get", url, null, null, null, true);
};

const postRequest = (url, data) => {
  return httpClient.execute("post", url, data, null, header, true);
};

const putRequest = (url, data) => {
  return httpClient.execute(
    "put",
    `${url}/${data.id}`,
    data.payload,
    null,
    header,
    true
  );
};

const putRequestForFormData = (url, data) => {
  return httpClient.execute(
    "put",
    `${url}/${data.id}`,
    data.payload,
    null,
    { "Content-Type": "multipart/form-data" },
    true
  );
};

const putRequestForProfile = (url, data) => {
  return httpClient.execute(
    "put",
    url,
    data.payload,
    null,
    null,
    true
  );
};

const deleteRequest = (url, id) => {
  return httpClient.execute("delete", `${url}/${id}`, null, null, header, true);
};

const getByIdRequest = (url, id) => {
  return httpClient.execute("get", `${url}/${id}`, null, null, header, true);
};

const apis = {
  noTokenPostRequest,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  getByIdRequest,
  putRequestForProfile,
  postRequestForFormData,
  putRequestForFormData,
};

export default apis;
