
import { Link } from "react-router-dom";

const ProductGrid = ({ products = [], error, loading }) => {
  if (loading) {
    return <p className="text-center py-8">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-600">{error}</p>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <p className="text-center py-8 text-gray-500">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
      {products.map((product) => {
        const imageUrl = product.images?.[0];

        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block group"
          >
            <div className="bg-white p-4 rounded-lg">
              <div className="overflow-hidden rounded-xl bg-gray-100">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name || "Product"}
                    className="w-full h-64 md:h-80 object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              <div className="px-2">
                <h3 className="mt-3 font-semibold text-gray-900 truncate">
                  {product.name}
                </h3>

                {product.discountedPrice != null &&
                  product.price != null &&
                  product.discountedPrice < product.price && (
                    <p className="text-gray-400 line-through">
                      Rs. {product.price}
                    </p>
                  )}

                <p className="text-xl font-bold text-[#ea2e0e]">
                  Rs. {product.discountedPrice ?? product.price}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
