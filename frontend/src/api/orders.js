import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`; 


// Create a global axios instance (helps maintain consistency)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }, 
});

// API Call to Send Shipping Email
export const sendShippingEmail = async (orderId, token) => {
  const response = await axios.post(
    `${API_URL}/api/orders/${orderId}/send-confirmation`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch logged-in user's orders
export const getUserOrders = async (token) => {
  try {
    const response = await axiosInstance.get("/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user orders:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch all orders (Admin)
export const getAllOrders = async (token) => {
  try {
    const response = await axiosInstance.get("/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.response?.data || error.message);
    throw error;
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axiosInstance.put(
      `/${orderId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating order ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete Order (Admin)
export const deleteOrder = async (orderId, token) => {
  try {
    await axiosInstance.delete(`/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return orderId;
  } catch (error) {
    console.error(`❌ Error deleting order ${orderId}:`, error.response?.data || error.message);
    throw error;
  }
};
