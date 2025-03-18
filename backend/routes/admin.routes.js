import express from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { 
  getAllUsers, 
  updateUserRole, 
  deleteUser 
} from "../controllers/admin.controller.js";

import { 
  getAllBooks, 
  addBook, 
  updateBook, 
  deleteBook, 
  approveBook 
} from "../controllers/book.controller.js";

import { 
  getAllOrders, 
  updateOrderStatus, 
  deleteOrder 
} from "../controllers/order.controller.js";

const router = express.Router();

// Admin: Manage Users
router.route("/users").get(protect, isAdmin, getAllUsers);
router.route("/users/:id")
  .put(protect, isAdmin, updateUserRole)
  .delete(protect, isAdmin, deleteUser);

// Admin: Manage Books
router.route("/books")
  .get(protect, isAdmin, getAllBooks)
  .post(protect, isAdmin, addBook);

router.route("/books/:id")
  .put(protect, isAdmin, updateBook)
  .delete(protect, isAdmin, deleteBook);

router.put("/books/:id/approve", protect, isAdmin, approveBook);

// Admin: Manage Orders
router.route("/orders")
  .get(protect, isAdmin, getAllOrders);

router.route("/orders/:id")
  .put(protect, isAdmin, updateOrderStatus)
  .delete(protect, isAdmin, deleteOrder);

export default router;
