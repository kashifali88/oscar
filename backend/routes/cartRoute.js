import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const cartRouter = new express.Router();

cartRouter.post("/add", verifyToken, addToCart);
cartRouter.delete("/:productId", verifyToken, removeFromCart);
cartRouter.get("/get", verifyToken, getCart);



export default cartRouter;