
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch all user orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/my-orders`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch orders"
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

// Fetch a single user order by ID
export const fetchUserOrderById = createAsyncThunk(
  "orders/fetchUserOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch order"
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

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    loading: false,
    error: null,
    orders: [],
    selectedOrder: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.myOrders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch orders";
      })

      // Fetch one order by ID
      .addCase(fetchUserOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedOrder = action.payload.order;
      })
      .addCase(fetchUserOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch order";
      });
  },
});

export default orderSlice.reducer;