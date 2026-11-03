import express from "express";

import {
  getProduct,
  getAllProducts,
  filterProducts,
  similarProducts,
  bestSellers,
  newArrivals,
} from "../controllers/productController.js";


const productRouter = express.Router();

// Specific GET routes first
productRouter.get("/getAll", getAllProducts);
productRouter.get("/filter", filterProducts);
productRouter.get("/similar/:id", similarProducts);
productRouter.get("/best-seller", bestSellers);
productRouter.get("/new-arrivals", newArrivals);

// Dynamic route after specific routes
productRouter.get("/:id", getProduct);


export default productRouter;
