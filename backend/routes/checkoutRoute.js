
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  createCheckout,
  createStripeSession,
  verifyStripePayment,
  finalizeCheckout,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/create", verifyToken, createCheckout);

router.post("/:id/stripe", verifyToken, createStripeSession);

router.post("/verify-payment", verifyToken, verifyStripePayment);

router.post("/:id/finalize", verifyToken, finalizeCheckout);

export default router;
