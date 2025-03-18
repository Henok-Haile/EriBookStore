import React, { useState } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutButton = () => {
  const { items } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        { items },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to initiate checkout. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading} className="checkout-btn">
      {loading ? "Processing..." : "Proceed to Checkout"}
    </button>
  );
};

export default CheckoutButton;
