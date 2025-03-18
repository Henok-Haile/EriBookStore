import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`; 

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

export const getProfile = async (token) => {
  return await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Send Password Reset Email
export const sendResetPasswordEmail = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};