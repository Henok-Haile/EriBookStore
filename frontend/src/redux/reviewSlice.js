import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReviews, postReview, removeReview } from "../api/reviews";

// Fetch reviews
export const fetchReviews = createAsyncThunk("reviews/fetchReviews", async (bookId, thunkAPI) => {
  try {
    return await getReviews(bookId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Add a new review
export const addReview = createAsyncThunk("reviews/addReview", async ({ bookId, rating, comment }, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    return await postReview(bookId, rating, comment, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Delete a review
export const deleteReview = createAsyncThunk("reviews/deleteReview", async ({ bookId, reviewId }, thunkAPI) => {
  const token = localStorage.getItem("token");
  try {
    return await removeReview(bookId, reviewId, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const reviewSlice = createSlice({
  name: "reviews",
  initialState: { reviews: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload || [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload); // Add to beginning of list
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((review) => review._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
