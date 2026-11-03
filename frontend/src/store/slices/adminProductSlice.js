
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API = `${import.meta.env.VITE_BACKEND_URL}/admin/products`;

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "admin/products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch products");
      }

      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "admin/products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to create product");
      }

      return data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "admin/products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to update product");
      }

      return data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "admin/products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to delete product");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",

  initialState: {
    products: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default adminProductSlice.reducer;
