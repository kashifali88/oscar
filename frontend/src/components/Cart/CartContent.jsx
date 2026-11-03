import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import { fetchCart, removeItemFromCart } from "../../store/slices/cartSlice";

const CartContent = () => {
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);

  const products = cart?.products || [];

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeItemFromCart(productId)).unwrap();
    } catch (error) {
      console.error("Remove cart item error:", error);
    }
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  if (loading && products.length === 0) {
    return <p className="text-center py-6">Loading cart...</p>;
  }

  if (error && products.length === 0) {
    return (
      <p className="text-center text-red-600 py-6">
        {typeof error === "string" ? error : error.message}
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center py-6 text-gray-500">Your cart is empty.</p>
    );
  }

  return (
    <div>
      {products.map((product) => (
        <div
          className="flex items-start justify-between py-4 border-b border-gray-300"
          key={`${product.productId}-${product.color}-${product.size}`}
        >
          <div className="flex items-start">
            <img
              src={product.image || product.images?.[0]}
              alt={product.name}
              className="w-20 h-20 object-cover mr-4 rounded"
            />

            <div>
              <h3>{product.name}</h3>

              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>

              <div className="flex items-center mt-2">
                <span className="text-sm px-2">
                  Quantity: {product.quantity}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium">Rs. {product.price.toLocaleString()}</p>

            <button
              onClick={() => handleRemoveItem(product.productId)}
              className="mt-2"
              aria-label={`Remove ${product.name}`}
            >
              <RiDeleteBin3Line className="w-6 h-6 text-red-600" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg mt-6">
        <span>Total</span>
        <span>Rs. {totalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CartContent;
