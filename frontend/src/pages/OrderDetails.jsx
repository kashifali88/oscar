
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrderDetails = () => {
  const { id } = useParams();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/order/my-orders/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch order details");
        }

        setOrderDetails(data.order);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        {error}
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-16">
        No order details found!
      </div>
    );
  }

  const shipping = orderDetails.shippingAddress || {};

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">

      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Order Details
      </h2>

      <div className="p-4 sm:p-6 rounded-lg border border-gray-200">

        {/* Order information */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">

          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order ID: #{orderDetails._id}
            </h3>

            <p className="text-gray-600 mt-1">
              {new Date(orderDetails.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                orderDetails.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {orderDetails.isPaid ? "Paid" : "Unpaid"}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {orderDetails.isDelivered ? "Delivered" : "Not Delivered"}
            </span>

          </div>
        </div>

        {/* Payment information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">

          <div>
            <h4 className="text-lg font-semibold mb-2">
              Payment Info
            </h4>

            <p>
              Payment Method: {orderDetails.paymentMethod || "N/A"}
            </p>

            <p>
              Status:{" "}
              <span className={orderDetails.isPaid ? "text-green-600" : "text-red-600"}>
                {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>

        </div>

        {/* Shipping information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">

          <div>
            <h4 className="text-lg font-semibold mb-2">
              Shipping Info
            </h4>

            <p>
              Name: {shipping.firstName || ""} {shipping.lastName || ""}
            </p>

            <p>
              Address: {shipping.address || "N/A"}
            </p>

            <p>
              City: {shipping.city || "N/A"}
            </p>

            <p>
              Postal Code: {shipping.postalCode || "N/A"}
            </p>

            <p>
              Country: {shipping.country || "N/A"}
            </p>

            <p>
              Phone: {shipping.phone || "N/A"}
            </p>
          </div>

        </div>

        {/* Products */}
        <div className="overflow-x-auto">

          <h4 className="text-lg font-semibold mb-4">
            Products
          </h4>

          <table className="min-w-full text-gray-600 mb-4">

            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Unit Price</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Total</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.orderItems?.map((item, index) => (
                <tr
                  key={item._id || item.productId || index}
                  className="border-b border-gray-300"
                >

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">

                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded-lg"
                      />

                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>

                    </div>
                  </td>

                  <td className="py-2 px-4">
                    ${item.price}
                  </td>

                  <td className="py-2 px-4">
                    {item.quantity}
                  </td>

                  <td className="py-2 px-4 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* Order total */}
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-semibold text-lg">
            Order Total
          </span>

          <span className="font-bold text-xl text-[#ea2e0e]">
            ${orderDetails.totalPrice}
          </span>
        </div>

        {/* Back to orders */}
        <Link
          to="/profile"
          className="inline-block mt-6 text-blue-500 hover:underline"
        >
          Back to My Orders
        </Link>

      </div>
    </div>
  );
};

export default OrderDetails;
