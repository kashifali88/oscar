
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiLoader, FiXCircle } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const verifyAndFinalizeOrder = async () => {
      try {
        // Get Stripe session ID from the URL
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          throw new Error("Payment session ID is missing.");
        }

        // Step 1: Verify payment with Stripe through backend
        const verifyResponse = await fetch(
          `${BACKEND_URL}/checkout/verify-payment`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyData.success) {
          throw new Error(
            verifyData.message || "Payment verification failed."
          );
        }

        const checkoutId = verifyData.checkoutId;

        if (!checkoutId) {
          throw new Error("Checkout ID is missing.");
        }

        // Step 2: Finalize checkout and create order
        const orderResponse = await fetch(
          `${BACKEND_URL}/checkout/${checkoutId}/finalize`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const orderData = await orderResponse.json();

        if (!orderResponse.ok || !orderData.success) {
          throw new Error(
            orderData.message || "Unable to create your order."
          );
        }

        setOrder(orderData.order);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndFinalizeOrder();
  }, [searchParams]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <FiLoader className="text-4xl text-[#ea2e0e] animate-spin" />
        <h2 className="mt-4 text-xl font-semibold">
          Verifying your payment...
        </h2>
        <p className="text-gray-500 mt-2">
          Please don't close this page.
        </p>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <FiXCircle className="text-6xl text-red-500" />

        <h2 className="text-2xl font-bold mt-4">
          Payment verification failed
        </h2>

        <p className="text-gray-500 mt-2 max-w-md">
          {error}
        </p>

        <Link
          to="/cart"
          className="mt-6 bg-[#ea2e0e] text-white px-6 py-3 rounded-lg"
        >
          Return to Cart
        </Link>
      </div>
    );
  }

  // Success screen
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <FiCheckCircle className="text-7xl text-green-500" />

      <h1 className="text-3xl font-bold mt-5">
        Payment Successful!
      </h1>

      <p className="text-gray-500 mt-2">
        Thank you for shopping with Oscar.
      </p>

      {order && (
        <div className="mt-6 bg-gray-50 border rounded-xl p-5 w-full max-w-md">
          <p className="text-gray-500 text-sm">
            Order ID
          </p>

          <p className="font-semibold break-all mt-1">
            {order._id}
          </p>

          <p className="text-gray-500 text-sm mt-4">
            Total Amount
          </p>

          <p className="text-xl font-bold mt-1">
            ${order.totalPrice}
          </p>
        </div>
      )}

      <Link
        to="/"
        className="mt-7 bg-[#ea2e0e] text-white px-7 py-3 rounded-lg hover:bg-[#c9250b] transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default PaymentSuccess;
