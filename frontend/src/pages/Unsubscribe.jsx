import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Unsubscribe = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    let isMounted = true; // ✅ Prevent multiple API calls

    const unsubscribeUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/newsletter/unsubscribe/${token}`);
        
        if (isMounted) {
          setMessage(response.data.message);
          toast.success(response.data.message);
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error.response?.data?.message || "Something went wrong!";
          setMessage(errorMessage);
          
          // ✅ Check if the error is because the link is expired
          if (error.response?.status === 410) {
            toast.warn("⚠️ This unsubscribe link has already been used.");
          } else {
            toast.error("❌ Invalid or expired unsubscribe link.");
          }
        }
      }
    };

    unsubscribeUser();

    return () => {
      isMounted = false; // ✅ Cleanup to prevent duplicate calls
    };
  }, [token]);

  return (
    <div className="unsubscribe-container">
      <h2>📩 {message}</h2>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
};

export default Unsubscribe;
