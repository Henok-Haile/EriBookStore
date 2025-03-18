import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup, login, getProfile, sendResetPasswordEmail } from "../api/auth";

// Retrieve token and user from localStorage (to persist login)
const savedToken = localStorage.getItem("token") || null;
const savedUser = JSON.parse(localStorage.getItem("user")) || null;

// User Signup
export const signupUser = createAsyncThunk("auth/signup", async (userData, thunkAPI) => {
  try {
    const response = await signup(userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Signup failed.");
  }
});

// User Login
export const userLogin = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const response = await login(userData);
    localStorage.setItem("token", response.data.token); // Save token
    localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed.");
  }
});

// Fetch User Profile
export const fetchProfile = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  if (!token) return thunkAPI.rejectWithValue("No token found");
  
  try {
    const response = await getProfile(token);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch profile.");
  }
});

// Forgot Password (Send Reset Email)
export const sendPasswordResetEmail = createAsyncThunk(
  "auth/sendPasswordResetEmail",
  async (email, thunkAPI) => {
    try {
      const response = await sendResetPasswordEmail(email);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error sending reset email.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: savedUser, token: savedToken, error: null, loading: false },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token"); 
      localStorage.removeItem("user"); 
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
