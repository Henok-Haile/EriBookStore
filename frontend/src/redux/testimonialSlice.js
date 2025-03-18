import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Testimonials
export const getTestimonials = createAsyncThunk("testimonials/getAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/testimonials`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error fetching testimonials");
  }
});

// Add Testimonial
export const createTestimonial = createAsyncThunk("testimonials/add", async ({ formData, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/testimonials`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",  // ✅ Ensures proper handling
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding testimonial");
    }
  });
  

// Delete Testimonial
export const removeTestimonial = createAsyncThunk("testimonials/delete", async ({ id, token }, thunkAPI) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/testimonials/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Error deleting testimonial");
  }
});

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTestimonials.pending, (state) => { state.loading = true; })
      .addCase(getTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(removeTestimonial.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default testimonialSlice.reducer;
