
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  fetchSimilarProducts,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { FaWhatsapp } from "react-icons/fa";

const ProductDetails = ({ productId }) => {
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    selectedProduct,
    similarProducts = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  const productFetchId = productId || id;

  // Fetch product and similar products
  useEffect(() => {
    if (!productFetchId) return;

    dispatch(fetchProductById(productFetchId));
    dispatch(fetchSimilarProducts(productFetchId));
  }, [dispatch, productFetchId]);

  // Set the main image when the product changes
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0]);
    } else {
      setMainImage(null);
    }

    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  }, [selectedProduct]);

  // Add product to cart
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.");
      return;
    }

    if (!productFetchId) {
      toast.error("Product ID is missing.");
      return;
    }

    try {
      setIsButtonDisabled(true);

      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
        })
      ).unwrap();

      toast.success("Product added to cart successfully!");
    } catch (err) {
      console.log("Add to cart error:", err);

      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Failed to add product to cart"
      );
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Contact us through WhatsApp
  const handleWhatsAppClick = () => {
    const phoneNumber = "923195378220";

    const productPrice =
      selectedProduct.discountedPrice ?? selectedProduct.price;

    const message = `Hello Oscar! I'm interested in this product.

Product: ${selectedProduct.name}
Price: Rs. ${productPrice}
Color: ${selectedColor || "Not selected"}
Size: ${selectedSize || "Not selected"}
Quantity: ${quantity}
Product Link: ${window.location.href}

Please provide more details about this product.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (loading && !selectedProduct) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  // Error state
  if (error && !selectedProduct) {
    return (
      <p className="text-center text-red-600 py-10">
        Error: {typeof error === "string" ? error : error.message}
      </p>
    );
  }

  // Product not found
  if (!selectedProduct) {
    return (
      <p className="text-center py-10">
        Product not found.
      </p>
    );
  }

  const images = Array.isArray(selectedProduct.images)
    ? selectedProduct.images
    : [];

  const colors = Array.isArray(selectedProduct.colors)
    ? selectedProduct.colors
    : [];

  const sizes = Array.isArray(selectedProduct.sizes)
    ? selectedProduct.sizes
    : [];

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto py-8">
      <h2 className="text-3xl text-center text-gray-900 font-bold mb-4">
        {productId ? "Best Seller" : selectedProduct.name}
      </h2>

      <p className="text-center text-sm text-gray-600 mx-auto max-w-2xl">
        Shop our most-loved styles chosen by customers.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Product images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-1/2">
          {/* Image thumbnails */}
          <div className="flex flex-row lg:flex-col gap-3 flex-wrap">
            {images.map((image, index) =>
              image ? (
                <img
                  onClick={() => setMainImage(image)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  src={image}
                  key={index}
                  alt={selectedProduct.name}
                />
              ) : null
            )}
          </div>

          {/* Main image */}
          <div className="flex-1 min-w-0">
            {mainImage ? (
              <img
                className="w-full h-[350px] md:h-[500px] object-cover object-top rounded-lg"
                src={mainImage}
                alt={selectedProduct.name}
              />
            ) : (
              <div className="w-full h-[350px] md:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product information */}
        <div className="flex-1 mt-6 lg:mt-0 lg:ml-8">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            {selectedProduct.name}
          </h1>

          {selectedProduct.price != null &&
            selectedProduct.discountedPrice != null &&
            selectedProduct.price > selectedProduct.discountedPrice && (
              <p className="text-gray-400 line-through">
                Rs. {selectedProduct.price}
              </p>
            )}

          <p className="text-2xl font-bold text-[#ea2e0e]">
            Rs. {selectedProduct.discountedPrice ?? selectedProduct.price}
          </p>

          <p className="text-gray-600 mb-4 mt-3">
            {selectedProduct.description}
          </p>

          {/* Colors */}
          <div className="mb-4">
            <p className="text-gray-700">Color: {selectedColor}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
              {colors.map((color) => (
                <button
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-black ring-2 ring-gray-300"
                      : "border-gray-300"
                  }`}
                  key={color}
                  title={color}
                  aria-label={`Select ${color}`}
                  style={{
                    backgroundColor: color.toLowerCase(),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-4">
            <p className="text-gray-700">Size: {selectedSize}</p>

            <div className="flex mt-2 gap-2 flex-wrap">
              {sizes.map((size) => (
                <button
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded border border-gray-300 ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                  key={size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <p className="text-gray-700">Quantity:</p>

            <div className="flex items-center space-x-3 mt-2">
              <button
                type="button"
                className="px-3 py-1 bg-gray-200 rounded text-lg"
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                disabled={quantity <= 1}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                className="px-3 py-1 bg-gray-200 rounded text-lg"
                onClick={() =>
                  setQuantity((prev) =>
                    selectedProduct.totalStock > 0
                      ? Math.min(selectedProduct.totalStock, prev + 1)
                      : prev + 1
                  )
                }
                disabled={
                  selectedProduct.totalStock > 0 &&
                  quantity >= selectedProduct.totalStock
                }
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-1/2 bg-black px-6 py-3 text-white rounded mb-4 disabled:opacity-50"
            disabled={
              isButtonDisabled ||
              selectedProduct.totalStock === 0
            }
          >
            {isButtonDisabled
              ? "Adding to Cart..."
              : selectedProduct.totalStock === 0
                ? "Out of Stock"
                : "Add To Cart"}
          </button>

          {/* Product characteristics */}
          <div className="mt-8 text-gray-700">
            <h3 className="text-xl font-bold mb-4">
              Characteristics
            </h3>

            <table className="w-full text-left text-sm text-gray-600">
              <tbody>
                <tr>
                  <td className="py-2 px-4 border border-gray-400">
                    Brand
                  </td>
                  <td className="py-2 px-4 border border-gray-400">
                    {selectedProduct.brand || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-4 border border-gray-400">
                    Category
                  </td>
                  <td className="py-2 px-4 border border-gray-400">
                    {selectedProduct.category || "N/A"}
                  </td>
                </tr>

                <tr>
                  <td className="py-2 px-4 border border-gray-400">
                    Gender
                  </td>
                  <td className="py-2 px-4 border border-gray-400">
                    {selectedProduct.gender || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Similar products */}
      <div className="mt-20">
        <h2 className="text-3xl text-center text-gray-900 font-bold mb-4">
          You May Also Like
        </h2>

        <ProductGrid products={similarProducts} />
      </div>

      {/* Floating WhatsApp Button */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={34} />
      </button>
    </div>
  );
};

export default ProductDetails;
