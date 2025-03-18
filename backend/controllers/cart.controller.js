import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";

// Add Book to Cart
export const addToCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity = 1 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const cartItem = user.cart.find((item) => String(item.book) === bookId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();
    res.status(200).json({ message: "Book added to cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: `Error adding to cart: ${error.message}` });
  }
};

// Remove Book from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.cart = user.cart.filter((item) => String(item.book) !== bookId);
    await user.save();

    res.status(200).json({ message: "Book removed from cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: `Error removing book from cart: ${error.message}` });
  }
};

// Get User's Cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.book", "title author coverImage price");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving cart: ${error.message}` });
  }
};

// Update Cart Item Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1." });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const cartItem = user.cart.find((item) => String(item.book) === bookId);
    if (!cartItem) return res.status(404).json({ message: "Book not found in cart." });

    cartItem.quantity = quantity;
    await user.save();

    res.status(200).json({ message: "Cart updated.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: `Error updating cart: ${error.message}` });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { cart: [] }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ message: "Cart cleared." });
  } catch (error) {
    res.status(500).json({ message: `Error clearing cart: ${error.message}` });
  }
};
