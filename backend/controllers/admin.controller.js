import { User } from "../models/user.model.js";

// Get all users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error fetching users: ${error.message}` });
  }
};

// Update User Role (Admin Only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role. Allowed values: 'admin', 'user'." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.isAdmin = role === "admin";
    await user.save();

    res.status(200).json({ success: true, message: `User role updated to ${role}.`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error updating user role: ${error.message}` });
  }
};

// Delete User (Prevent Self-Deletion)
export const deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json({ success: false, message: "Admins cannot delete themselves." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error deleting user: ${error.message}` });
  }
};
