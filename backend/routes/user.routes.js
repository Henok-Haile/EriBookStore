import express from "express";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../middleware/upload.middleware.js";
import { 
  updateUserProfile, 
  updateUserPassword, 
  updateUserAvatar, 
  getUserProfile, 
  getAllUsers, 
  deleteUser 
} from "../controllers/user.controller.js";

const router = express.Router();

// User Profile Routes (Protected)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile/password", protect, updateUserPassword);
router.post("/avatar", protect, uploadAvatar, updateUserAvatar);

// Admin Routes (Protected & Admin Only)
router.get("/", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router;
