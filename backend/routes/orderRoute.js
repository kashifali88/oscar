import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { myOrder, myOrders } from "../controllers/orderController.js";


const router = express.Router();

router.get("/my-orders",verifyToken, myOrders);
router.get("/my-orders/:id",verifyToken, myOrder);


export default router;