import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:3000", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
