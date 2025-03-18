import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  addReview, 
  getReviews, 
  updateReview, 
  deleteReview 
} from "../controllers/review.controller.js";

const router = express.Router();

// Public Routes
router.get("/:bookId", getReviews);

// Protected Routes (Users can add, update, or delete their reviews)
router.post("/:bookId", protect, addReview);
router.put("/:bookId/:reviewId", protect, updateReview);
router.delete("/:bookId/:reviewId", protect, deleteReview);

export default router;
