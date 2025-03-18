import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, updateUserRole, deleteUser } from "../api/adminUsers";
import { updateProfile, updatePassword, uploadAvatar, fetchProfile } from "../api/user";

// Fetch All Users (Admin Only)
export const fetchAllUsers = createAsyncThunk("users/fetchAll", async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
        const users = await getAllUsers(token);
        return users;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error fetching users.");
    }
});

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk("user/fetchProfile", async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchProfile(token);
    
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching user profile.");
    }
  });
  

// Update User Role (Make Admin)
export const promoteUserToAdmin = createAsyncThunk("users/promote", async (userId, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
        await updateUserRole(userId, token);
        return userId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Delete a User (Admin)
export const deleteUserById = createAsyncThunk("users/delete", async (userId, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
        await deleteUser(userId, token);
        return userId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// Update Logged-in User Profile
export const updateUserProfile = createAsyncThunk("user/updateProfile", async (userData, thunkAPI) => {
    try {
        const response = await updateProfile(userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error updating profile");
    }
});

// Update Password
export const updateUserPassword = createAsyncThunk("user/updatePassword", async (passwordData, thunkAPI) => {
    try {
        const response = await updatePassword(passwordData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error updating password");
    }
});

// Update Avatar
export const updateUserAvatar = createAsyncThunk("user/updateAvatar", async (formData, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
        const response = await uploadAvatar(formData, token);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || "Error uploading avatar");
    }
});

const userSlice = createSlice({
    //   name: "user",
    name: "auth", // Use 'auth' slice (ensures it updates correctly)
    initialState: {
        // user: {},
        user: JSON.parse(localStorage.getItem("user")) || null,
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All Users (Admin)
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Promote User to Admin
            .addCase(promoteUserToAdmin.fulfilled, (state, action) => {
                const user = state.users.find((u) => u._id === action.payload);
                if (user) user.isAdmin = true;
            })

            // Delete User (Admin)
            .addCase(deleteUserById.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })

           
            // Update User Password
            .addCase(updateUserPassword.fulfilled, () => {
                console.log("Password updated successfully!");
            })

            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = { ...state.user, ...action.payload.user };
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.avatar = action.payload.avatar; 
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            });


    },
});

export default userSlice.reducer;
