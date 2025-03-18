import express from "express";
import { 
  getTestimonials, 
  addTestimonial, 
  deleteTestimonial 
} from "../controllers/testimonial.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { uploadTestimonialImage } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public Routes
router.get("/", getTestimonials);

// Admin Routes (Protected)
router.post("/", protect, isAdmin, uploadTestimonialImage, addTestimonial);
router.delete("/:id", protect, isAdmin, deleteTestimonial);

export default router;
