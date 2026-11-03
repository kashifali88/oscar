import { errorHandler } from "../utils/errorHandler.js";
import Order from "../models/orderModel.js"
import { catchAsyncError } from "../utils/catchAsyncError.js";



// my orders

export const myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    myOrders: orders,
  });
});

// get order by :id
export const myOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name, email");
    if(!order) {
        return next(errorHandler(404, 'No order found'))
    }
    res.status(200).json({success: true, order})
})