import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  addToCart, 
  removeFromCart, 
  getCart, 
  updateCartQuantity, 
  clearCart 
} from "../controllers/cart.controller.js";

const router = express.Router();

// Cart Routes (Protected)
router.get("/", protect, getCart);
router.post("/:bookId", protect, addToCart);
router.put("/:bookId", protect, updateCartQuantity);
router.delete("/:bookId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
