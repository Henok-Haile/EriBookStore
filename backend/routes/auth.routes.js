import express from "express";
import { 
  signup, 
  login, 
  verifyEmail, 
  resendVerificationEmail, 
  forgotPassword, 
  resetPassword, 
  getUserProfile 
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User Profile Route
router.get("/profile", protect, getUserProfile);

export default router;
