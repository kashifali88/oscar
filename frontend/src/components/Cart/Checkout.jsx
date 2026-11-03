
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);

  const [checkoutId, setCheckoutId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const products = cart?.products || [];

  const totalPrice = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.quantity),
    0
  );

  // Handle shipping form and create checkout
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      return toast.error("Your cart is empty");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/checkout/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkoutItems: products,
            shippingAddress,
            paymentMethod: "card",
            totalPrice,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Checkout creation failed");
      }

      setCheckoutId(data.checkout._id);
      toast.success("Checkout created successfully!");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Redirect customer to Stripe
  const handleStripePayment = async () => {
    try {
      setPaymentLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/checkout/${checkoutId}/stripe`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to start Stripe payment");
      }

      if (!data.url) {
        throw new Error("Stripe payment URL not received");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(error.message || "Payment failed");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 tracking-tighter gap-8 max-w-7xl mx-auto py-10 px-6">

      {/* Left Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value="user@email.com"
              className="w-full p-2 border border-gray-300 rounded"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>

          {/* First and Last Name */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          {/* City and Postal Code */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          {/* Payment Section */}
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
              >
                {loading ? "Creating Checkout..." : "Continue to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Stripe</h3>

                <button
                  type="button"
                  onClick={handleStripePayment}
                  disabled={paymentLoading}
                  className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
                >
                  {paymentLoading
                    ? "Redirecting to Stripe..."
                    : "Pay with Stripe"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        <div className="border-t border-gray-300 py-4 mb-4">
          {products.map((product, index) => (
            <div
              key={product._id || index}
              className="flex items-start justify-between py-2 border-b border-gray-300"
            >
              <div className="flex items-start">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />

                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                  <p className="text-gray-500">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </div>

              <p className="text-xl">
                ${(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <span>${totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-lg">
          <p>Shipping</p>
          <p className="text-green-500">Free</p>
        </div>

        <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-gray-300">
          <p>Total</p>
          <p>${totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
