import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;

// Get user cart
export const getCart = async (token) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Add book to cart
export const addToCart = async (bookId, quantity, token) => {
  return await axios.post(`${API_URL}/${bookId}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update cart quantity
export const updateCartQuantity = async (bookId, quantity, token) => {
  return await axios.put(`${API_URL}/${bookId}`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Remove book from cart
export const removeFromCart = async (bookId, token) => {
  return await axios.delete(`${API_URL}/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Clear entire cart
export const clearCart = async (token) => {
  return await axios.delete(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
