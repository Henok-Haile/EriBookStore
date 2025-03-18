import React from "react";
import "../styles/footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa"; // Social Media Icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 🔹 Column 1 - About Us */}
        <div className="footer-column about">
          <h3>About EriBookStore</h3>
          <p>
            EriBookStore is your one-stop shop for discovering and purchasing
            books across various categories. We bring knowledge to your
            fingertips.
          </p>
        </div>

        {/* 🔹 Column 2 - Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-list">
            <li><a href="/">🏠 Home</a></li>
            <li><a href="/books">📚 Books</a></li>
            <li><a href="/about">ℹ About Us</a></li>
            <li><a href="/contact">📧 Contact</a></li>
          </ul>
        </div>

        {/* 🔹 Column 3 - Policies */}
        <div className="footer-column">
          <h3>Policies</h3>
          <ul className="footer-list">
            <li><a href="/privacy">🔒 Privacy Policy</a></li>
            <li><a href="/terms">📜 Terms & Conditions</a></li>
            <li><a href="/shipping">🚚 Shipping & Returns</a></li>
            <li><a href="/faq">❓ FAQs</a></li>
          </ul>
        </div>

        {/* 🔹 Column 4 - Social Media */}
        <div className="footer-column">
          <h3>Connect with Us</h3>
          <div className="social-links">
            <a href="https://web.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook /> Facebook
            </a>
            <a href="https://x.com/EriBookStore" target="_blank" rel="noopener noreferrer">
              <FaTwitter /> Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> Instagram
            </a>
            <a href="mailto:info@eribookstore.com">
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 EriBookStore. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
