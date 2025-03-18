import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Newsletter.css"

const NewsletterForm = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(user ? user.email : ""); // Auto-fill user's email
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("⚠️ Email is required!");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/newsletter/subscribe`, { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message);
      setSubscribed(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Subscription failed");
    }
  };

  return (
    <div className="newsletter-container">
      <h3>📩 Subscribe to Our Newsletter</h3>
      {subscribed ? (
        <p>You're subscribed! Check your email for updates.</p>
      ) : (
        <form onSubmit={handleSubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!user} // Disable if user is logged in
            placeholder="Enter your email"
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
};

export default NewsletterForm;
