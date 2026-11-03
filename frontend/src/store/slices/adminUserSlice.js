
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = `${import.meta.env.VITE_BACKEND_URL}/admin/users`;

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch users");
      }

      return data.users;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create user
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to create user");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user (including role)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to update user");
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to delete user");
      }

      return data.deletedUser._id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default adminUserSlice.reducer;
