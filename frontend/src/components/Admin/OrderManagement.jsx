import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../store/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      alert("Order status updated successfully!");
    } catch (error) {
      alert(error || "Failed to update order");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteOrder(id)).unwrap();
      alert("Order deleted successfully!");
    } catch (error) {
      alert(error || "Failed to delete order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {loading && orders.length === 0 && (
        <p className="text-gray-500">Loading orders...</p>
      )}

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && !loading ? (
              <tr>
                <td
                  className="p-4 text-center text-gray-500"
                  colSpan={5}
                >
                  No orders found!
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    {order._id}
                  </td>

                  <td className="px-4 py-3">
                    {order.user?.username ||
                      order.user?.username ||
                      order.user?.email ||
                      "Unknown"}
                  </td>

                  <td className="px-4 py-3">
                    {order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border p-2 rounded-md border-gray-200 outline-none"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 flex gap-2">
                    {order.status !== "delivered" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "delivered")
                        }
                        className="p-2 text-sm hover:bg-green-600 rounded text-white bg-green-500"
                      >
                        Mark Delivered
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(order._id)}
                      className="p-2 text-sm hover:bg-red-600 rounded text-white bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;