import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Retrieve user info and token from localstorage
const storedUser = localStorage.getItem("userInfo");
const userFromStorage = storedUser ? JSON.parse(storedUser) : null;

// initial state
const initialState = {
  user: userFromStorage,
  loading: false,
  error: null,
};

// async thunk for user login
export const loginUser = createAsyncThunk(
  "/auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "login failed");
      }
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", JSON.stringify(data.token));
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "something went wrong");
    }
  },
);

// async thunk for google login
// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  "/auth/googleLogin",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Google login failed");
      }

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data.userWithOutPassword),
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);
// async thunk for register user
export const registerUser = createAsyncThunk(
  "/auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", JSON.stringify(data.token));
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "something went wrong");
    }
  },
);

// create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Google Login / Register
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.userWithOutPassword;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google authentication failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
