import express from "express";
import { 
  createCheckoutSession, 
  confirmPayment 
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Payment Routes
router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/confirm-payment", confirmPayment); // Stripe callback (no auth required)

export default router;
