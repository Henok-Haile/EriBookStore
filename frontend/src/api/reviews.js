import axios from "axios";

// Use environment variable dynamically
const API_URL = `${import.meta.env.VITE_API_URL}/api/reviews`;

// Create an axios instance for review-related requests
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Fetch reviews for a book
export const getReviews = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/${bookId}`);
    return response.data; // Ensure data is returned properly
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.response?.data || error.message);
    throw error.response?.data || "Error fetching reviews.";
  }
};

// Add a new review
export const postReview = async (bookId, rating, comment, token) => {
  try {
    const response = await axiosInstance.post(
      `/${bookId}`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.review; // Ensure it returns only the review object
  } catch (error) {
    console.error("❌ Error adding review:", error.response?.data || error.message);
    throw error.response?.data || "Error adding review.";
  }
};

// Delete a review
export const removeReview = async (bookId, reviewId, token) => {
  try {
    await axiosInstance.delete(`/${bookId}/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return reviewId;
  } catch (error) {
    console.error("❌ Error deleting review:", error.response?.data || error.message);
    throw error.response?.data || "Error deleting review.";
  }
};
