import express from "express";
import { 
  getBooks, getAllBooks, getBookById, suggestBook, approveBook, 
  addBook, updateBook, deleteBook, getBookCategories, 
  getFeaturedBooks, getBooksByCategory 
} from "../controllers/book.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { uploadCoverImage } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public Routes (Users can only see approved books)
router.get("/", getBooks); 
router.get("/categories", getBookCategories);
router.get("/featured", getFeaturedBooks);
router.get("/categories/:category", getBooksByCategory);
router.get("/:id", getBookById);

// Protected Routes (Users can suggest books)
router.post("/suggest", protect, suggestBook);

// Admin Routes
router.get("/admin/all", protect, isAdmin, getAllBooks);
router.put("/:id/approve", protect, isAdmin, approveBook);
router.delete("/:id", protect, isAdmin, deleteBook);

// Admin: Add or Update Books with Image Upload
router.post("/", protect, isAdmin, uploadCoverImage, addBook);
router.put("/:id", protect, isAdmin, uploadCoverImage, updateBook);

export default router;
