// src/api/auth.js
import axiosInstance from "../utils/axiosInstance";

// Signup API
export const signup = (formData) => {
  return axiosInstance.post("/auth/signup", formData);
};

// Login API
export const login = (credentials) => {
  return axiosInstance.post("/auth/login", credentials);
};