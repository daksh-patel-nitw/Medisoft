import httpClient from "./httpClient";

const header = {
  "Content-Type": "application/json",
};


const noTokenPostRequest = (url, data) => {
  return httpClient.executeNoTokenRequest( "post", url, data, null, header, false);
};

const noTokenStatusPostRequest = (url, data) => {
  return httpClient.executeNoTokenStatusRequest( "post", url, data, null, header, false);
};

const noTokengetRequest = (url) => {
  return httpClient.executeNoTokenRequest("get", url, null, null, null, false);
};


const noTokenputRequest = (url, data) => {
  return httpClient.executeNoTokenRequest( "put", url, data, null, header, false);
};
const noTokenStatusPutRequest = (url, data) => {
  return httpClient.executeNoTokenStatusRequest( "put", url, data, null, header, false);
};

const noTokenStatusDeleteRequest = (url, id) => {
  // console.log( `${url}/${id}`);
  return httpClient.executeNoTokenStatusRequest("delete", `${url}/${id}`, null, null, {}, false);
};

const noTokengetByIdRequest = (url, id) => {
  return httpClient.executeNoTokenRequest("get", `${url}/${id}`, null, null, header, false);
};

//------------------------ Protected Requests --------------------------------
const getRequest = (url) => {
  return httpClient.execute("get", url, null, null, header, true);
};

const postRequest = (url, data) => {
  return httpClient.execute("post", url, data, null, header, true);
};

const putRequest = (url, data) => {
  return httpClient.execute( "put", url, data, null, header, true);
};

const deleteRequest = (url, id) => {
  return httpClient.execute("delete", `${url}/${id}`, null, null, header, true);
};

const getByIdRequest = (url, id) => {
  return httpClient.execute("get", `${url}/${id}`, null, null, header, true);
};

//------------------------ File Upload Requests --------------------------------
const uploadFileRequest = (url, formData) => {
  return httpClient.executeFileUpload("put", url, formData, null, {}, false); // false = no token
};

export const apis = {
  noTokenPostRequest,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  getByIdRequest,
  noTokengetRequest,
  noTokenStatusPostRequest,
  noTokenStatusDeleteRequest,
  noTokenStatusPutRequest,
  noTokenputRequest,
  noTokengetByIdRequest,

  //Using for file upload
  uploadFileRequest,
};


