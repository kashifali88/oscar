import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../store/slices/adminProductSlice";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.adminProducts);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountedPrice: "",
    description: "",
    totalStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    gender: "Unisex",
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Upload images to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploading(true);
    setImageError("");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing.");
      }

      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} is not an image.`);
          }

          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: uploadData,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error?.message || "Image upload failed.");
          }

          return data.secure_url;
        })
      );

      setImages((previousImages) => [
        ...previousImages,
        ...uploadedImages,
      ]);
    } catch (error) {
      setImageError(error.message || "Failed to upload images.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Add image using URL
  const handleAddImageUrl = () => {
    const url = imageUrl.trim();

    if (!url) return;

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS image URLs are allowed.");
      }

      setImages((previousImages) => [...previousImages, url]);
      setImageUrl("");
      setImageError("");
    } catch {
      setImageError("Please enter a valid image URL.");
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((previousImages) =>
      previousImages.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait until image uploads finish.");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),

      discountedPrice: formData.discountedPrice
        ? Number(formData.discountedPrice)
        : undefined,

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

      images,
    };

    try {
      await dispatch(createProduct(productData)).unwrap();

      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      alert(error || "Failed to create product.");
    }
  };

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
    { name: "collections", label: "Collections (Summer, New Arrivals)" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Create Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product fields */}
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
              required={[
                "name",
                "sku",
                "price",
                "category",
              ].includes(field.name)}
              min={field.type === "number" ? "0" : undefined}
              className="w-full border border-gray-300 rounded p-3 outline-none focus:border-black"
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">
            Gender
          </label>

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

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full border border-gray-300 rounded p-3 outline-none"
          />
        </div>

        {/* Product Images */}
        <div className="border border-gray-200 rounded-lg p-5 space-y-4">

          <h3 className="text-lg font-semibold">
            Product Images
          </h3>

          {/* Upload from computer */}
          <div>
            <label className="block mb-2 font-medium">
              Upload Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full border border-gray-300 rounded p-3"
            />

            <p className="text-sm text-gray-500 mt-1">
              Select one or multiple images from your computer.
            </p>

            {uploading && (
              <p className="text-blue-600 text-sm mt-2">
                Uploading images to Cloudinary...
              </p>
            )}
          </div>

          {/* Add image URL */}
          <div>
            <label className="block mb-2 font-medium">
              Or Add Image URL
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-gray-300 rounded p-3 outline-none"
              />

              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-slate-800 text-white px-5 py-3 rounded hover:bg-slate-700"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Image errors */}
          {imageError && (
            <p className="text-red-500 text-sm">
              {imageError}
            </p>
          )}

          {/* Image previews */}
          {images.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">
                Selected Images ({images.length})
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative border rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-36 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 hover:bg-red-700"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && (
            <p className="text-sm text-gray-500">
              No product images added yet.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {uploading
            ? "Uploading Images..."
            : loading
              ? "Creating..."
              : "Create Product"}
        </button>

      </form>
    </div>
  );
};

export default CreateProduct;