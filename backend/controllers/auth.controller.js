import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/emailService.js";
import cloudinary from "../config/cloudinary.config.js";

// Helper Functions
const generateToken = (id, isAdmin) => 
  jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

const generateVerificationToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// User Signup with Email Verification
export const signup = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists. Please log in." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    let avatarUrl = "";
    if (avatar) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, { folder: "EriBookStore/Users" });
      avatarUrl = uploadResponse.secure_url;
    }

    const user = await new User({ name, email, password, isVerified: false, avatar: avatarUrl }).save();

    await sendVerificationEmail(user.email, generateVerificationToken(user._id), user.name);

    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Check your email." });
    }

    const token = generateToken(user._id, user.isAdmin);
    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Invalid or already verified." });
    }

    user.isVerified = true;
    await user.save();
    res.json({ message: "Email verified. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Resend Verification Email
export const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Invalid request." });
    }

    await sendVerificationEmail(user.email, generateVerificationToken(user._id));
    res.json({ message: "New verification email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error resending verification email." });
  }
};

// Forgot Password (Send Reset Email)
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(500).json({ message: "Error sending reset email." });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user does not exist." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile." });
  }
};
