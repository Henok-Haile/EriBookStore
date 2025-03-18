import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/wishlist`;

export const getWishlist = async (token) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addToWishlist = async (bookId, token) => {
  return await axios.post(API_URL, { bookId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeFromWishlist = async (bookId, token) => {
  return await axios.delete(`${API_URL}/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
