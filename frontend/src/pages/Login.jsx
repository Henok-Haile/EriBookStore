import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin, sendPasswordResetEmail } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
   

// Handle Login
const handleLogin = async (e) => {
  e.preventDefault();
  setError(""); // Clear previous errors
  const result = await dispatch(userLogin({ email, password }));

  if (result.payload) {
    navigate("/Home"); // Redirect on success
  } else {
    setError("Invalid email or password. Try again."); // Show error
  }
};

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      navigate("/forgot-password"); // If email is empty, go to Forgot Password page
    } else {
      try {
        await dispatch(sendPasswordResetEmail(email)); // Send reset link
        toast.success("Password reset link sent! Check your email.");
      } catch (error) {
        toast.error("Error sending reset email. Try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-header">Welcome Back! 👋</h2>
      <p className="login-subtext">Sign in to continue your journey 📚</p>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="📧 Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="🔒 Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        {error && <p className="error">{error}</p>}{" "}
        {/* Show error if exists */}
        <button type="submit" className="login-button">
          Login
        </button>
        {/* Forgot Password & Signup Links */}
        <div className="login-links">
          <button onClick={handleForgotPassword} className="forgot-password">
            Forgot Password?
          </button>
          <p>
            New here?{" "}
            <Link to="/signup" className="signup-link">
              Create an Account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
