import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5555";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) return;

      const token = localStorage.getItem("token"); // ✅ Get token

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/payment/confirm-payment?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Send token in headers
            },
          }
        );

        console.log("✅ Payment Confirmed:", response.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error confirming payment:", err);
        setError(err.response?.data?.message || "Payment confirmation failed");
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="order-success-container">
      <h2>🎉 Payment Successful!</h2>
      {loading ? (
        <p>Confirming payment...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Thank you for your order!</p>
      )}
      <button onClick={() => navigate("/dashboard/orders")}>Go to My Orders</button>
    </div>
  );
};

export default OrderSuccess;
