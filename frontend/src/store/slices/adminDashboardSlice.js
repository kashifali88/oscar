import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`;

export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch dashboard data"
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",

  initialState: {
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalOrders = action.payload.totalOrders;
        state.totalProducts = action.payload.totalProducts;
        state.totalRevenue = action.payload.totalRevenue;
        state.recentOrders = action.payload.recentOrders;
      })

      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message;
      });
  },
});

export default adminDashboardSlice.reducer;