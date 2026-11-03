
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import Checkout from "../models/checkoutModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create checkout
export const createCheckout = catchAsyncError(async (req, res, next) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return next(errorHandler(400, "No item found to checkout"));
  }

  const checkout = await Checkout.create({
    user: req.user._id,
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: "Pending",
    isPaid: false,
  });

  res.status(201).json({
    success: true,
    message: "Checkout created",
    checkout,
  });
});

// 2. Create Stripe session
export const createStripeSession = catchAsyncError(
  async (req, res, next) => {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return next(errorHandler(404, "Checkout not found"));
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return next(errorHandler(403, "Not authorized"));
    }

    if (checkout.paymentMethod !== "card" || checkout.isPaid) {
      return next(errorHandler(400, "Invalid payment request"));
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: checkout.checkoutItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

      metadata: {
        checkoutId: checkout._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  }
);

// 3. Verify Stripe payment
export const verifyStripePayment = catchAsyncError(
  async (req, res, next) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      return next(errorHandler(400, "Stripe session ID is required"));
    }

    // Retrieve session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return next(errorHandler(400, "Payment has not been completed"));
    }

    // Get checkout ID from Stripe metadata
    const checkoutId = session.metadata?.checkoutId;

    if (!checkoutId) {
      return next(errorHandler(400, "Checkout ID missing"));
    }

    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return next(errorHandler(404, "Checkout not found"));
    }

    // Verify checkout owner
    if (checkout.user.toString() !== req.user._id.toString()) {
      return next(errorHandler(403, "Not authorized"));
    }

    // Verify payment amount and currency
    if (
      session.currency !== "usd" ||
      session.amount_total !== Math.round(checkout.totalPrice * 100)
    ) {
      return next(errorHandler(400, "Payment amount does not match checkout"));
    }

    if (!checkout.isPaid) {
      checkout.isPaid = true;
      checkout.paymentStatus = "paid";
      checkout.paymentDetails = session.payment_intent;
      checkout.paidAt = new Date();

      await checkout.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      checkoutId: checkout._id,
    });
  }
);

// 4. Finalize checkout and create order
export const finalizeCheckout = catchAsyncError(
  async (req, res, next) => {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return next(errorHandler(404, "Checkout not found"));
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return next(errorHandler(403, "Not authorized"));
    }

    // Prevent duplicate order creation
    if (checkout.isFinalized) {
      return next(errorHandler(400, "Checkout already finalized"));
    }

    if (!checkout.isPaid) {
      return next(errorHandler(400, "Checkout is not paid"));
    }

    const finalOrder = await Order.create({
      user: checkout.user,

      orderItems: checkout.checkoutItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),

      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();

    await checkout.save();

    await Cart.findOneAndDelete({
      user: checkout.user,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: finalOrder,
    });
  }
);
