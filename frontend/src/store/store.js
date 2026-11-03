import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js"
import productReducer from "./slices/productSlice.js"
import cartReducer from "./slices/cartSlice.js"
import checkoutReducer from "./slices/checkoutSlice.js"
import orderReducer from "./slices/orderSlice.js"
import adminReducer from "./slices/adminUserSlice.js"
import adminProductReducer from "./slices/adminProductSlice.js"
import adminOrderSlice from "./slices/adminOrderSlice.js"
import adminUserReducer from './slices/adminUserSlice.js'
import adminDashboardReducer from "./slices/adminDashboardSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        order: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrderSlice,
        adminUsers: adminUserReducer,
        adminDashboard: adminDashboardReducer,


    }
});

export default store;