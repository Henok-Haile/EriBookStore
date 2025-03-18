import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";

// Fetch wishlist from API
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const response = await getWishlist(token);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching wishlist");
    }
  }
);


// Add book to wishlist
export const addBookToWishlist = createAsyncThunk(
  "wishlist/add",
  async (bookId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await addToWishlist(bookId, token);

      return response.data.wishlist;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding to wishlist");
    }
  }
);

// Remove book from wishlist
export const removeBookFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (bookId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await removeFromWishlist(bookId, token);
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error removing from wishlist");
    }
  }
);


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { books: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(addBookToWishlist.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(removeBookFromWishlist.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
