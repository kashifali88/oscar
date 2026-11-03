import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../store/slices/adminDashboardSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    totalOrders,
    totalProducts,
    totalRevenue,
    recentOrders,
    loading,
    error,
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Revenue */}
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            Revenue
          </h2>

          <p className="text-2xl text-slate-700">
            {loading ? "Loading..." : `PKR ${totalRevenue.toLocaleString()}`}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            Total Orders
          </h2>

          <p className="text-2xl text-slate-700">
            {loading ? "Loading..." : totalOrders}
          </p>

          <Link
            to="/admin/orders"
            className="text-blue-500 hover:underline"
          >
            View Orders
          </Link>
        </div>

        {/* Total Products */}
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">
            Total Products
          </h2>

          <p className="text-2xl text-slate-700">
            {loading ? "Loading..." : totalProducts}
          </p>

          <Link
            to="/admin/products"
            className="text-blue-500 hover:underline"
          >
            View Products
          </Link>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="mt-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <Link
            to="/admin/orders"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg">

          <table className="min-w-full text-left text-gray-500">

            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total Price</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>

              {loading && recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Loading orders...
                  </td>
                </tr>
              ) : recentOrders.length > 0 ? (

                recentOrders.map((order) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50"
                    key={order._id}
                  >

                    <td className="p-4">
                      {order._id}
                    </td>

                    <td className="p-4">
                      {order.user?.name ||
                        order.user?.username ||
                        order.user?.email ||
                        "Unknown"}
                    </td>

                    <td className="p-4">
                      PKR {order.totalPrice?.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span className="capitalize">
                        {order.status}
                      </span>
                    </td>

                  </tr>
                ))

              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center"
                  >
                    No orders found!
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default AdminHomePage;