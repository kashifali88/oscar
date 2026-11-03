import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem("cart");

  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};


// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cart/get`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch user cart"
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



// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, color, size, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            color,
            size,
            quantity,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          data.message || "Failed to add product to cart"
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

// delete item from cart
export const removeItemFromCart = createAsyncThunk("cart/removeItemFromCart", async (productId, {rejectWithValue}) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`,{
            method: "DELETE",
            credentials: "include",
        });
        const data = await res.json();
        if(!res.ok){
            return rejectWithValue(data.message || "failed to remove item")
        }
        return data;
    } catch (error) {
       return rejectWithValue(error.message || "failed to remove item")
    }
});


const cartSlice = createSlice({
    name: "cart",
    initialState:{
        cart: loadCartFromLocalStorage(),
        loading: false,
        error: null
    },
    reducers: {
      clearCart: (state)=> {
        state.cart = { products: [] };
        localStorage.removeItem("cart");
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.cart = action.payload.cart;
            saveCartToStorage(action.payload.cart)
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || action.payload || "failed to fetch cart"
        })
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.cart = action.payload.cart;
            saveCartToStorage(action.payload.cart)
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || action.payload 
        })
        .addCase(removeItemFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeItemFromCart.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.cart = action.payload.cart;
            saveCartToStorage(action.payload.cart)
        })
        .addCase(removeItemFromCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || action.payload 
        })
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;