import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../styles/CartOverview.css"; // Make sure to create and style this file

const CartOverview = () => {
  const cartItems = useSelector((state) => state.cart.items);

  // ✅ Calculate total quantity of items in the cart
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Calculate total price of all items in the cart
  const totalPrice = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0).toFixed(2);

  return (
    <div className="cart-overview">
      <h3>🛒 Cart Overview</h3>
      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-summary">
          <p><strong>Total Items:</strong> {totalQuantity}</p>
          <p><strong>Total Price:</strong> ${totalPrice}</p>
          <Link to="/cart" className="btn-primary">Go to Cart</Link>
        </div>
      )}
    </div>
  );
};

export default CartOverview;
