import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout", async(checkoutData,{rejectWithValue}) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkout/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(checkoutData)
        })
        const data = await res.json();
        if(!res.ok) {
            return rejectWithValue(data.message || "failed to create checkout")
        }
        return data;
    } catch (error) {
        return rejectWithValue(error.message || "something went wrong")
    }
});


const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        loading: false,
        error: null,
        checkout: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state,action) => {
            state.loading = false;
            state.error = null;
            state.checkout = action.payload.checkout
        })
        .addCase(createCheckout.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message || action.payload || "failed to create checkout";
        })
    }
})

export default checkoutSlice.reducer;