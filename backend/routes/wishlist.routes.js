import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist 
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// Wishlist Routes (Protected)
router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:bookId", protect, removeFromWishlist);

export default router;
