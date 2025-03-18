import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookDetails } from "../redux/bookSlice";
import { fetchReviews, addReview, deleteReview } from "../redux/reviewSlice";
import { useParams } from "react-router-dom";
import { addBookToCart } from "../redux/cartSlice";
import { addBookToWishlist } from "../redux/wishlistSlice";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/BookDetails.css";
import { FaHeart, FaStar, FaTrash, FaPen } from "react-icons/fa"; // ✅ Import Icons

const BookDetails = () => {
  const { id: bookId } = useParams();
  const dispatch = useDispatch();

  // ✅ Redux States
  const { bookDetails, error } = useSelector((state) => state.books);
  const { reviews, loading: reviewLoading } = useSelector((state) => state.reviews);
  const { token, user } = useSelector((state) => state.auth);

  // ✅ Component States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false); // ✅ State for Review Modal

  // ✅ Fetch Book Details & Reviews
  useEffect(() => {
    dispatch(fetchBookDetails(bookId));
    dispatch(fetchReviews(bookId));
    checkPurchase();
  }, [dispatch, bookId]);

  // ✅ Check if user already reviewed
  useEffect(() => {
    if (user && reviews.length > 0) {
      const userReview = reviews.find((review) => review.user?._id === user._id);
      setHasReviewed(!!userReview);
    }
  }, [reviews, user]);

  // ✅ Check if user purchased the book
  const checkPurchase = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format");
      }

      const purchasedBooks = response.data.flatMap((order) =>
        order.books.map((b) => b.book?._id)
      );

      setHasPurchased(purchasedBooks.includes(bookId));
    } catch (error) {
      console.error("❌ Error checking purchase:", error);
    }
  };

  // ✅ Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("⚠️ Please log in to submit a review!");
      return;
    }
    try {
      await dispatch(addReview({ bookId, rating, comment })).unwrap();
      toast.success("✅ Review submitted successfully!");
      setComment("");
      setRating(5);
      setHasReviewed(true);
      setShowReviewForm(false); // ✅ Close the modal after submitting
    } catch (error) {
      toast.error(error.message || "❌ Failed to submit review.");
    }
  };

  // ✅ Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!token) return;
    try {
      await dispatch(deleteReview({ bookId, reviewId })).unwrap();
      toast.success("✅ Review deleted successfully!");
    } catch (error) {
      toast.error(error.message || "❌ Failed to delete review.");
    }
  };

  // ✅ Add to Cart
  const handleAddToCart = () => {
    if (!token) {
      toast.error("⚠️ Please log in to add books to your cart!");
      return;
    }
    dispatch(addBookToCart({ bookId, quantity: 1 }));
    toast.success("✅ Book added to cart! 🛒");
  };

  // ✅ Add to Wishlist
  const handleAddToWishlist = () => {
    if (!token) {
      toast.error("⚠️ Please log in to save books to your wishlist!");
      return;
    }
    dispatch(addBookToWishlist(bookId));
    toast.success("💖 Book added to wishlist!");
  };

  // ✅ Share Book (Copy to Clipboard)
  const handleShareBook = () => {
    const bookUrl = `${window.location.origin}/books/${bookId}`;
    navigator.clipboard.writeText(bookUrl);
    toast.info("📢 Book link copied to clipboard!");
  };

  if (!bookDetails) return <p className="error-message">❌ Book not found.</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="book-details-container">
      {/* ✅ Book Details Section */}
      <div className="book-details-section">
        {/* ✅ Book Cover */}
        <div className="book-cover">
          <img src={bookDetails.coverImage || "/images/default-book.jpg"} alt={bookDetails.title} />
        </div>

        {/* ✅ Book Info */}
        <div className="book-info">
          <h2>{bookDetails.title}</h2>
          <p><strong>✍ Author:</strong> {bookDetails.author}</p>
          <p><strong>📂 Category:</strong> {bookDetails.category || "Uncategorized"}</p>
          <p className="price"><strong>💰 Price:</strong> ${bookDetails.price || "N/A"}</p>

          {/* ✅ Floating Wishlist & Review Buttons */}
          <div className="floating-buttons">
            <button className="wishlist-btn" onClick={handleAddToWishlist}>
              <FaHeart className="wishlist-icon" />
            </button>
            {token && hasPurchased && !hasReviewed && (
              <button className="review-btn" onClick={() => setShowReviewForm(true)}>
                <FaPen className="review-icon" />
              </button>
            )}
          </div>

          {/* ✅ Action Buttons */}
          <div className="book-actions">
            <button onClick={handleAddToCart} className="btn btn-primary">🛒 Add to Cart</button>
            <button onClick={handleShareBook} className="btn btn-secondary">📢 Share</button>
          </div>
        </div>
      </div>

      {/* ✅ Customer Reviews */}
      <div className="reviews-section">
        <h3>📢 Customer Reviews</h3>
        {reviewLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-item">
                <p><strong>{review.user?.name}:</strong> {review.comment}</p>
                <p className="review-stars">
                  {[...Array(review.rating)].map((_, index) => (
                    <FaStar key={index} className="star filled" />
                  ))}
                </p>
                {user && (user._id === review.user?._id || user.isAdmin) && (
                  <button onClick={() => handleDeleteReview(review._id)} className="delete-btn">
                    <FaTrash />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Review Form Modal */}
      {showReviewForm && (
        <div className="review-modal">
          <div className="review-modal-content">
            <h3>✍ Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <label>⭐ Rating:</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className={`star ${star <= (hoverRating || rating) ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  />
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
              <button type="submit" className="btn-submit-review">📩 Submit Review</button>
            </form>
            <button onClick={() => setShowReviewForm(false)} className="close-btn">❌</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
