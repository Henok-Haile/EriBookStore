import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/users`;


// Get all users (Admin Only)
export const getAllUsers = async (token) => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
  
    if (!Array.isArray(response.data.users)) {
      console.error("API did not return an array!", response.data);
      throw new Error("Invalid API response: Expected an array of users.");
    }
  
    return response.data.users;
  };

// Promote user to Admin
export const updateUserRole = async (userId, token) => {
    return await axios.put(
      `${API_URL}/${userId}`,
      { role: "admin" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

// Delete a user
export const deleteUser = async (userId, token) => {
  return await axios.delete(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


  