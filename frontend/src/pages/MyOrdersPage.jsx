
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/order/my-orders`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.myOrders || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">
        My Orders
      </h2>

      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">

          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Shipping Address</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* Product image */}
                  <td className="py-3 px-4">
                    <img
                      src={
                        order.orderItems?.[0]?.image ||
                        "/placeholder.png"
                      }
                      alt="Product"
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>

                  {/* Order ID */}
                  <td className="py-3 px-4 font-medium">
                    <Link
                      to={`/my-orders/${order._id}`}
                      className="text-[#ea2e0e] hover:underline"
                    >
                      #{order._id.slice(-8)}
                    </Link>
                  </td>

                  {/* Created date */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* Shipping address */}
                  <td className="py-3 px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  {/* Items */}
                  <td className="py-3 px-4">
                    {order.orderItems?.reduce(
                      (total, item) => total + item.quantity,
                      0
                    ) || 0}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-semibold text-gray-800 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        order.isDelivered
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.isDelivered
                        ? "Delivered"
                        : order.paymentStatus || "Processing"}
                    </span>
                  </td>

                  {/* View details */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Link
                      to={`/my-orders/${order._id}`}
                      className="text-[#ea2e0e] font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >
                  You haven't placed any orders yet.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
