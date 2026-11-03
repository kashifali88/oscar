
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminProducts,
  deleteProduct,
} from "../../store/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      alert("Product deleted successfully");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

      <div className="p-6 rounded-lg mb-6 shadow">
        <h3 className="text-lg font-bold mb-4">Add New Product</h3>

        <Link
          to="/admin/create-product"
          className="bg-green-500 text-white hover:bg-green-600 p-2 rounded"
        >
          Add Product
        </Link>
      </div>

      {loading && <p className="py-4">Loading products...</p>}

      {error && <p className="text-red-500 py-4">{error}</p>}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="text-xs bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-4">{product.name}</td>

                <td className="px-4 py-4">
                  ${Number(product.price).toFixed(2)}
                </td>

                <td className="px-4 py-4">{product.sku}</td>

                <td className="px-4 py-4">{product.totalStock}</td>

                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/update/${product._id}`}
                      className="bg-blue-500 rounded px-3 py-1.5 text-sm text-white hover:bg-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="bg-red-500 rounded px-3 py-1.5 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
