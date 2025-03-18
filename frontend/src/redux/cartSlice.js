import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from "../api/cart";

// Fetch cart items
export const fetchCart = createAsyncThunk("cart/fetch", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  if (!token) return thunkAPI.rejectWithValue("No token found");
  try {
    const response = await getCart(token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Add book to cart
export const addBookToCart = createAsyncThunk("cart/add", async ({ bookId, quantity }, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    await addToCart(bookId, quantity, token);
    return { bookId, quantity };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk("cart/update", async ({ bookId, quantity }, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    await updateCartQuantity(bookId, quantity, token);
    return { bookId, quantity };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Remove book from cart
export const removeBookFromCart = createAsyncThunk("cart/remove", async (bookId, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    await removeFromCart(bookId, token);
    return bookId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Clear entire cart
export const clearUserCart = createAsyncThunk("cart/clear", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    await clearCart(token);
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map(item => ({
          ...item,
          bookId: item.book._id || item.bookId
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addBookToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const item = state.items.find((item) => item.bookId === action.payload.bookId);
        if (item) item.quantity = action.payload.quantity;
      })
      .addCase(removeBookFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.bookId !== action.payload);
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
