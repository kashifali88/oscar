import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch products by collection and optional filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchProductByFilters",
  async (
    {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      brand,
      limit,
    },
    { rejectWithValue },
  ) => {
    try {
      const query = new URLSearchParams();

      if (collection) query.append("collection", collection);
      if (size) query.append("size", size);
      if (color) query.append("color", color);
      if (gender) query.append("gender", gender);
      if (minPrice != null) query.append("minPrice", minPrice);
      if (maxPrice != null) query.append("maxPrice", maxPrice);
      if (sortBy) query.append("sortBy", sortBy);
      if (search) query.append("search", search);
      if (category) query.append("category", category);
      if (brand) query.append("brand", brand);
      if (limit != null) query.append("limit", limit);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/filter?${query.toString()}`,
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch products");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// Fetch a single product by its ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/${id}`,
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch product");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/similar/${id}`,
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch similar products",
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// Update product details
export const updateProductDetails = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to update product");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    similarProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        collection: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch products with filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.products = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.products)
            ? action.payload.products
            : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch products";
      })

      // Fetch a single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selectedProduct = action.payload?.product ?? action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to fetch product";
      })

      // Fetch similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.similarProducts = action.payload?.products ?? [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error.message ||
          "Failed to fetch similar products";
      })

      // Update product details
      .addCase(updateProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedProduct = action.payload?.product ?? action.payload;
        const index = state.products.findIndex((product) => product._id === updatedProduct._id);
        if(index >= 0 ){
            state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to update product";
      });
  },
});


export const {setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
