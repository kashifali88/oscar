import express from "express";
import Product from "../../models/productModel.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
const router = express.Router();

// get products (admin only)
router.get("/", verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
const products = await Product.find();
res.status(200).json({success: true, products})
}))

// create product
router.post("/",verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
  const {
    name, description, discountedPrice, price, totalStock,
    category, brand, sizes, colors, collections, gender,
    images, isFeatured, isPublished, tags, sku,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    discountedPrice,
    price,
    totalStock,
    category,
    brand,
    sizes,
    colors,
    collections,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    sku,
    user: req.user._id, 
  });
  res.status(201).json({success:true, message: "Product created successfully", product});
}));

// update product
router.put("/update/:id", verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
  const {user, rating, numReviews, ...updateData} = req.body;
  const updateProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true});
  if(!updateProduct) {
    return next(errorHandler(404, "product not found"))
  }
  res.status(200).json({success:true, message: "Product updated successfully", product: updateProduct});
}))

// delete product
router.delete("/:id", verifyToken, verifyAdmin, catchAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if(!product) return next(errorHandler(404, 'Product not found'));
  res.status(200).json({success:true, message: "Product deleted successfully"})
}))


export default router;