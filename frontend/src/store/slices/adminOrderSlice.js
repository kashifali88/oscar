import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = `${import.meta.env.VITE_BACKEND_URL}/admin/orders`;

// FETCH ALL ORDERS
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch orders");
      }

      return data.orders;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// UPDATE ORDER STATUS
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to update order");
      }

      return data.order;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// DELETE ORDER
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to delete order");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const adminOrderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH ORDERS
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // DELETE ORDER
      .addCase(deleteOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export default adminOrderSlice.reducer;