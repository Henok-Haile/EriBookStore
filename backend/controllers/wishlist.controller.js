import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";

// Add Book to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: "Book is already in wishlist." });
    }

    user.wishlist.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book added to wishlist.", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: `Error adding to wishlist: ${error.message}` });
  }
};

// Remove Book from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: bookId } },
      { new: true }
    ).select("wishlist");

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "Book removed from wishlist.", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: `Error removing book from wishlist: ${error.message}` });
  }
};

// Get User's Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "wishlist",
      "title author coverImage price"
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving wishlist: ${error.message}` });
  }
};
