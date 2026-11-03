
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store/store";

import UserLayout from "./components/Layout/UserLayout";
import AdminLayout from "./components/Admin/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";
import MyOrdersPage from "./pages/MyOrdersPage";

import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import AdminUpdateProduct from "./components/Admin/AdminUpdateProduct";
import OrderManagement from "./components/Admin/OrderManagement";

import ScrollToTop from "./components/Common/ScrollTops";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AdminRoute from "./components/Common/AdminRoute";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";
import CreateProduct from "./components/Admin/CreateProduct";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Public and user pages */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />

            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />

            <Route path="product/:id" element={<ProductDetails />} />

            {/* Pages requiring login */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<Profile />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="my-orders" element={<MyOrdersPage />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="/my-orders/:id" element={<OrderDetails />} />
            </Route>
          </Route>

          {/* Admin-only pages */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="create-product" element={<CreateProduct />} />
              <Route
                path="/admin/products/update/:id"
                element={<AdminUpdateProduct />}
              />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
