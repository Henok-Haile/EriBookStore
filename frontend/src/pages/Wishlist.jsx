import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeBookFromWishlist } from "../redux/wishlistSlice";
import { addBookToCart } from "../redux/cartSlice"; // ✅ Move to Cart Feature
import { Link } from "react-router-dom";
import "../styles/Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (bookId) => {
    if (window.confirm("Are you sure you want to remove this book from your wishlist?")) {
      dispatch(removeBookFromWishlist(bookId));
    }
  };

  const handleMoveToCart = (book) => {
    dispatch(addBookToCart({ bookId: book._id, quantity: 1 }));
    dispatch(removeBookFromWishlist(book._id)); // ✅ Remove from wishlist after adding to cart
  };

  if (loading) return <p className="wishlist-loading">Loading your wishlist...</p>;
  if (error) return <p className="wishlist-error">⚠ {error}</p>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">💖 My Wishlist</h2>

      {books.length === 0 ? (
        <div className="empty-wishlist">
          <img src="/images/empty-wishlist.svg" alt="Empty Wishlist" />
          <p>Your wishlist is empty! Start adding books you love. 📚</p>
          <Link to="/books" className="btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="wishlist-list">
          {books.map((book) => (
            <div key={book._id} className="wishlist-item">
              <img 
                src={book.coverImage || "/images/default-book.jpg"} 
                alt={book.title} 
                className="wishlist-image"
              />
              <div className="wishlist-info">
                <h5 className="wishlist-title">{book.title}</h5>
                <p className="wishlist-author">✍ {book.author}</p>
                <p className="wishlist-price">💰 ${book.price?.toFixed(2) || "N/A"}</p>
              </div>
              <div className="wishlist-actions">
                <button className="btn-primary" onClick={() => handleMoveToCart(book)}>
                  🛒 Move to Cart
                </button>
                <button className="btn-danger" onClick={() => handleRemove(book._id)}>
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
