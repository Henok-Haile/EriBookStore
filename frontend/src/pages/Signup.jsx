import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear errors when input fields change
  useEffect(() => {
    if (error) setError("");
  }, [name, email, password]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      await dispatch(signupUser({ name, email, password })).unwrap();
      
      // Notify user that verification email has been sent
      toast.success("Signup successful! Please check your email to verify your account. 📩");

      // Redirect to login page after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-header">Create an Account</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="👤 Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="password"
          placeholder="🔒 Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signup-input"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
