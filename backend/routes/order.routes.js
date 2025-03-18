import express from "express";
import { 
  getUserOrders, 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} from "../controllers/order.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Orders (Protected)
router.get("/", protect, getUserOrders);

// Admin Order Management (Protected & Admin Only)
router.get("/all", protect, isAdmin, getAllOrders);
router.put("/:orderId/status", protect, isAdmin, updateOrderStatus);
router.delete("/:orderId", protect, isAdmin, deleteOrder);

export default router;
