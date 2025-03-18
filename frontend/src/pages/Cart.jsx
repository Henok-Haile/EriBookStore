import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchCart, 
  updateCartItemQuantity, 
  removeBookFromCart, 
  clearUserCart 
} from "../redux/cartSlice";
import { addBookToWishlist } from "../redux/wishlistSlice";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import "../styles/Cart.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // ✅ Load Stripe

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (bookId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItemQuantity({ bookId, quantity }));
  };

  const handleRemove = (bookId) => {
    dispatch(removeBookFromCart(bookId));
  };

  const handleMoveToWishlist = (book) => {
    dispatch(addBookToWishlist(book));
    dispatch(removeBookFromCart(book._id)); 
  };

  const handleClearCart = () => {
    dispatch(clearUserCart());
  };

  // ✅ Calculate Total Price
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.book.price * item.quantity),
    0
  ).toFixed(2);

  // ✅ Handle Checkout
  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    console.log("📦 Items Sent to Backend:", items); // Debugging
  
    setLoadingCheckout(true);
    try {
      const stripe = await stripePromise;
  
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        { items },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      console.log("✅ Checkout Session Data:", data);
  
      stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert("Failed to initiate checkout. Try again.");
    } finally {
      setLoadingCheckout(false);
    }
  };
  

  if (loading) return <div className="cart-loading">Loading...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  return (
    <div className="cart-container">
      <h2>🛒 Shopping Cart</h2>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a href="/" className="btn-back">Continue Shopping</a>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item, index) => (
              <li key={item.book._id || `temp-${index}`} className="cart-item">
                <div className="cart-item-content">
                  <img 
                    src={item.book.coverImage || "/images/default-book.jpg"} 
                    alt={item.book.title} 
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.book.title}</h3>
                    <p className="cart-item-author">By {item.book.author}</p>

                    <div className="cart-item-quantity">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.quantity || 1}
                        onChange={(e) => handleQuantityChange(item.book._id, parseInt(e.target.value))}
                        className="cart-quantity-input"
                      />
                    </div>

                    <p className="cart-item-price">
                      ${item.book.price.toFixed(2)} x {item.quantity} = 
                      <strong> ${(item.book.price * item.quantity).toFixed(2)}</strong>
                    </p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <button 
                    className="btn-wishlist" 
                    onClick={() => handleMoveToWishlist(item.book)}
                  >
                    💖 Move to Wishlist
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleRemove(item.book._id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <p className="cart-total">
              <strong>Total: ${totalPrice}</strong>
            </p>
            <button className="cart-clear-btn" onClick={handleClearCart}>
              🗑 Clear Cart
            </button>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
