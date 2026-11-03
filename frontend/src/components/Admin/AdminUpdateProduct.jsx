
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchAdminProducts,
  updateProduct,
} from "../../store/slices/adminProductSlice";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector(
    (state) => state.adminProducts
  );

  const product = products.find((item) => item._id === id);

  const [formData, setFormData] = useState(null);

  // Fetch products if they are not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAdminProducts());
    }
  }, [dispatch, products.length]);

  // Fill form when product becomes available
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price ?? "",
        discountedPrice: product.discountedPrice ?? "",
        description: product.description || "",
        totalStock: product.totalStock ?? "",
        sku: product.sku || "",
        category: product.category || "",
        brand: product.brand || "",
        sizes: (product.sizes || []).join(", "),
        colors: (product.colors || []).join(", "),
        collections: (product.collections || []).join(", "),
        gender: product.gender || "Unisex",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      discountedPrice:
        formData.discountedPrice === ""
          ? undefined
          : Number(formData.discountedPrice),
      totalStock: Number(formData.totalStock),

      sizes: formData.sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      colors: formData.colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      collections: formData.collections
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await dispatch(
        updateProduct({
          id,
          productData,
        })
      ).unwrap();

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      alert(error);
    }
  };

  if (!formData) {
    return (
      <div className="p-6">
        {loading ? "Loading product..." : "Product not found."}
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Product Name" },
    { name: "sku", label: "SKU" },
    { name: "price", label: "Price", type: "number" },
    { name: "discountedPrice", label: "Discounted Price", type: "number" },
    { name: "totalStock", label: "Total Stock", type: "number" },
    { name: "brand", label: "Brand" },
    { name: "category", label: "Category" },
    { name: "sizes", label: "Sizes (S, M, L, XL)" },
    { name: "colors", label: "Colors (Red, Black)" },
    { name: "collections", label: "Collections" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-1 font-medium">
              {field.label}
            </label>

            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={
                ["name", "sku", "price", "category"].includes(field.name)
              }
              min={field.type === "number" ? "0" : undefined}
              className="w-full border border-gray-300 rounded p-3 outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Gender</label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-3"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full border border-gray-300 rounded p-3 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminUpdateProduct;
