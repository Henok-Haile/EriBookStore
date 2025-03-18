import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/orders`;

// Get all orders (Admin Only)
export const getAllOrders = async (token) => {
  return await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update order status
export const updateOrderStatus = async (orderId, status, token) => {
  return await axios.put(`${API_URL}/${orderId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete an order
export const deleteOrder = async (orderId, token) => {
  return await axios.delete(`${API_URL}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
