import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import { errorHandler } from "../utils/errorHandler.js";
import mongoose from "mongoose";



export const addToCart = catchAsyncError(async (req, res, next) => {
  const { productId, color, size } = req.body;
  const quantity = Number(req.body.quantity) || 1;
  const userId = req.user._id;

  // 1. Check product ID
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(errorHandler(400, "Invalid product ID"));
  }

  // 2. Find product
  const product = await Product.findById(productId);

  if (!product) {
    return next(errorHandler(404, "Product not found"));
  }

  // 3. Find user's cart
  let cart = await Cart.findOne({ user: userId });

  // 4. Create cart if it doesn't exist
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      products: [
        {
          productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          color,
          size,
          quantity,
        },
      ],
      totalPrice: product.price * quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Cart created",
      cart,
    });
  }

  // 5. Check if the same product, color and size already exist
  const item = cart.products.find(
    (p) =>
      p.productId.toString() === productId &&
      p.color === color &&
      p.size === size
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.products.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      color,
      size,
      quantity,
    });
  }

  // 6. Recalculate total price
  cart.totalPrice = cart.products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart,
  });
});

export const getCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { products: [], totalPrice: 0 },
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});
// route: DELETE /cart/:productId
export const removeFromCart = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(errorHandler(400, "Invalid product ID"));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(errorHandler(404, "Cart not found"));

  const item = cart.products.find(
    (p) =>
      p.productId.toString() === productId
  );
  if (!item) return next(errorHandler(404, "Item not found in cart"));

  cart.products.pull(item);

  cart.totalPrice = cart.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  await cart.save();

  res.status(200).json({ success: true, message: "Item removed from cart", cart });
});

