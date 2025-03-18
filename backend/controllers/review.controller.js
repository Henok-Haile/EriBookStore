import { Review } from "../models/review.model.js";
import { Book } from "../models/book.model.js";

// Add a Review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { bookId } = req.params;
    const userId = req.user.id;

    if (!rating || !comment) return res.status(400).json({ message: "Rating and comment are required." });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be between 1 and 5." });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this book." });

    const newReview = await Review.create({ book: bookId, user: userId, rating, comment });

    const reviews = await Review.find({ book: bookId });
    book.averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    book.totalReviews = reviews.length;
    await book.save();

    res.status(201).json({ message: "Review added successfully.", review: newReview });
  } catch (error) {
    res.status(500).json({ message: `Error adding review: ${error.message}` });
  }
};

// Get All Reviews for a Book
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving reviews: ${error.message}` });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId },
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found." });

    const reviews = await Review.find({ book: review.book });
    await Book.findByIdAndUpdate(review.book, {
      averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
    });

    res.json({ message: "Review updated successfully.", review });
  } catch (error) {
    res.status(500).json({ message: `Error updating review: ${error.message}` });
  }
};

// Delete Review (User can delete their own, Admin can delete any)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    const bookId = review.book;
    await review.deleteOne();

    const reviews = await Review.find({ book: bookId });
    await Book.findByIdAndUpdate(bookId, {
      averageRating: reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0,
      totalReviews: reviews.length,
    });

    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: `Error deleting review: ${error.message}` });
  }
};
