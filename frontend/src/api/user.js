import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Update Profile (Name/Email)
export const updateProfile = async (userData) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${API_URL}/profile`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update Password
export const updatePassword = async (passwordData) => {
  const token = localStorage.getItem("token");
  return await axios.put(`${API_URL}/profile/password`, passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Upload Avatar
export const uploadAvatar = async (formData, token) => {
    return await axios.post(`${API_URL}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  };

// Fetch User Profile
export const fetchProfile = async (token) => {
    return await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };