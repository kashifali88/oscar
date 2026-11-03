import express from "express";
import mongoose from "mongoose";
import Order from "../../models/orderModel.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { errorHandler } from "../../utils/errorHandler.js";

const router = express.Router();

const allowedStatuses = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// GET all orders
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  catchAsyncError(async (req, res) => {
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// UPDATE order status
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  catchAsyncError(async (req, res, next) => {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid order ID"));
    }

    if (!allowedStatuses.includes(status)) {
      return next(errorHandler(400, "Invalid order status"));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    order.status = status;
    order.isDelivered = status === "Delivered";

    if (status === "delivered") {
      order.deliveredAt = new Date();
    } else {
      order.deliveredAt = undefined;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  })
);

// DELETE order
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  catchAsyncError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid order ID"));
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return next(errorHandler(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  })
);

export default router;