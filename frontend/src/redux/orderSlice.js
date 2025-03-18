import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllOrders, updateOrderStatus, deleteOrder, getUserOrders, sendShippingEmail } from "../api/orders"; 

// Send Shipping Confirmation Email (Admin)
export const sendShippingConfirmation = createAsyncThunk(
  "orders/sendShippingConfirmation",
  async (orderId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await sendShippingEmail(orderId, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error sending shipping email.");
    }
  }
);

// Fetch user orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    const response = await getUserOrders(token);
    console.log("📦 Redux received orders:", response); 
    return response; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching user orders.");
  }
});

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    const response = await getAllOrders(token);
    console.log("📦 Redux fetched orders:", response);
    return response;
  } catch (error) {
    console.error("❌ Error fetching orders:", error.response?.data || error.message);
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching orders.");
  }
});

// Update Order Status (Admin) & Send Email for "Shipped"
export const updateOrder = createAsyncThunk("orders/updateStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const response = await updateOrderStatus(orderId, status, token);

    // If status is "Shipped", send shipping confirmation email
    if (status === "Shipped") {
      await sendShippingConfirmation(orderId, token);
    }

    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error updating order status.");
  }
});

// Delete an Order (Admin)
export const deleteOrderById = createAsyncThunk("orders/delete", async (orderId, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await deleteOrder(orderId, token);
    return orderId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error deleting order.");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log("📦 Storing orders in Redux:", action.payload);
        state.orders = action.payload || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status & send email when "Shipped"
      .addCase(updateOrder.fulfilled, (state, action) => {
        if (!action.payload) return;
        const updatedOrder = action.payload;

        const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      .addCase(sendShippingConfirmation.fulfilled, (state, action) => {
        console.log("📧 Shipping Confirmation Sent:", action.payload);
      })
      .addCase(sendShippingConfirmation.rejected, (state, action) => {
        console.error("❌ Failed to send shipping confirmation:", action.payload);
      })

      // Delete order (Admin)
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      });
  },
});

export default orderSlice.reducer;
