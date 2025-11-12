import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token automatically to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token expired, please log in again"
    ) {
      alert("⚠️ Session expired. Please log in again.");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
