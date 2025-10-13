// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api", // adjust if deployed
// });

// // Add token automatically
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


// export default axiosInstance;

import axios from "axios";
console.log("✅ Frontend ENV:",  import.meta.env.VITE_API_URL); // Debug



// const axiosInstance = axios.create({
//   // baseURL: "http://localhost:5000/api", // change to your API
//   baseURL: "https://saylani-hackton-eight.vercel.app/api", // change to your API
// });

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL
  baseURL:"https://saylani-hackton-eight.vercel.app/api"
  // baseURL: "http://localhost:5000/api",
});


// Interceptor for expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token expired, please log in again"
    ) {
      alert("⚠️ Session expired. Please log in again."); // ✅ alert here
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
