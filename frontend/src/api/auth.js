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

// Email Verification API
export const verifyEmail = (data) => {
  return axiosInstance.post("/auth/verify-email", data);
};

// Resend Verification OTP API
export const resendVerificationOTP = (email) => {
  return axiosInstance.post("/auth/resend-verification", { email });
};

// Login OTP Verification API
export const verifyOtp = (data) => {
  return axiosInstance.post("/auth/verify-otp", data);
};