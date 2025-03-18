import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaShoppingCart,
  FaUser,
  FaBookOpen,
  FaHome,
  FaStar,
  FaEnvelope,
  FaInfoCircle,
  FaHeart,
} from "react-icons/fa";
import "../styles/Navbar.css";
import { fetchUserProfile } from "../redux/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.books);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    setWishlistCount(wishlistItems.length);
  }, [cartItems, wishlistItems]);

  // Scroll to section based on ID when clicking a navbar link
  const handleScrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            📚 EriBookStore
          </Link>
        </div>

        <ul className="navbar-middle">
          <li>
            <Link to="/" className="nav-link">
              <FaHome className="nav-icon" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => handleScrollToSection("featured")}>
              <FaBookOpen className="nav-icon" />
              Featured
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => handleScrollToSection("testimonials")}>
              <FaStar className="nav-icon" />
              Reviews
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => handleScrollToSection("newsletter")}>
              <FaEnvelope className="nav-icon" />
              Newsletter
            </Link>
          </li>
          <li>
            <Link to="/" onClick={() => handleScrollToSection("about")}>
              <FaInfoCircle className="nav-icon" />
              About
            </Link>
          </li>
        </ul>

        <div className="navbar-right">
          {token ? (
            <>
              <div className="icon-container">
                <Link to="/wishlist" className="nav-icon">
                  <FaHeart />
                  {wishlistCount > 0 && (
                    <span className="badge">{wishlistCount}</span>
                  )}
                </Link>
              </div>

              <div className="icon-container">
                <Link to="/cart" className="nav-icon">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </Link>
              </div>

              <div
                className="user-dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="user-icon">
                  <Link to="/dashboard/profile">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="user-avatar"
                      />
                    ) : (
                      <FaUser className="default-avatar" />
                    )}
                  </Link>
                  <span className="user-name">{user?.name}</span>
                </div>

                <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                  <Link to="/dashboard">📊 Dashboard</Link>
                  <button onClick={handleLogout} className="btn-logout">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn-auth">
                Login
              </Link>
              <Link to="/signup" className="btn-auth">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
