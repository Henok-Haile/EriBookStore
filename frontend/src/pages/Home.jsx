import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFeaturedBooks } from "../api/books";
import { fetchTestimonials } from "../api/testimonials";
import { Link } from "react-router-dom";
import NewsletterForm from "../components/NewsletterForm";

// ✅ Import Swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [fetchError, setFetchError] = useState("");

  // ✅ Fetch Featured Books
  useEffect(() => {
    const getFeaturedBooks = async () => {
      try {
        const response = await fetchFeaturedBooks();
        setFeaturedBooks(response.data);
      } catch (err) {
        setFetchError("Failed to load featured books.");
      }
    };

    getFeaturedBooks();
  }, []);

  // ✅ Fetch Testimonials
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetchTestimonials();
        if (Array.isArray(response)) {
          setTestimonials(response); // ✅ Store testimonials as received
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to load testimonials.", error);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <div className="home-container">
      {/* ✅ Hero Section */}
      <div className="hero-section">
        <h1>Discover Your Next Favorite Book 📚</h1>
        <p>Browse thousands of books across different genres and categories.</p>
        <Link to="/books" className="btn-primary">
          Shop Now
        </Link>
      </div>

      {/* ✅ Featured Books Section */}
      <div id="featured" className="featured-section">
        <h2>✨ Featured Books</h2>
        {fetchError && <p className="error-message">{fetchError}</p>}

        <div className="book-grid">
          {featuredBooks.length === 0 ? (
            <p>No featured books available.</p>
          ) : (
            featuredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <img
                  src={book.coverImage || "/images/default-book.jpg"}
                  alt={book.title}
                />
                <h5>{book.title}</h5>
                <p>{book.author}</p>
                <Link to={`/books/${book._id}`} className="btn-primary">
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>

        {/* ✅ "View All Books" Button */}
        <div className="view-all-books">
          <Link to="/books" className="btn-secondary">
            View All Books →
          </Link>
        </div>
      </div>

      {/* ✅ Testimonials Section with Swiper.js */}
      <div id="testimonials" className="testimonials-section">
        <h2>⭐ What Our Readers Say</h2>
        {testimonials.length === 0 ? (
          <p>No testimonials available.</p>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop={testimonials.length > 1} // ✅ Prevent looping when only 1 testimonial exists
            className="testimonial-slider"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial._id || index} className="testimonial-card">
                <img
                  src={testimonial.image || "/images/default-user.jpg"}
                  alt={testimonial.name}
                  className="testimonial-image"
                />
                <p className="testimonial-message">
                  "{testimonial.text || "No message available"}" {/* ✅ FIXED HERE */}
                </p>
                <span className="testimonial-name">- {testimonial.name}</span>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ✅ Newsletter Section */}
      <div id="newsletter" className="newsletter-section">
        <NewsletterForm />
      </div>

      {/* ✅ About Section */}
      <div id="about" className="about-section">
        <h2>ℹ About EriBookStore</h2>
        <p>
          EriBookStore is your go-to destination for a vast collection of books
          across various genres. From timeless classics to modern bestsellers,
          we bring knowledge and entertainment to all readers!
        </p>
        <p>
        At ERIBOOKSTORE, we understand the power of stories in shaping our world and connecting us.
        Our mission is to provide a platform where Eritrean literature, as well as international titles, 
        can be discovered, shared, and celebrated. Whether you're looking for books in English or Tigrinya, 
        we've got something for everyone. Our store offers everything from novels, poetry, and history books 
        to educational materials, making it the ideal destination for readers of all ages.
        </p>
      </div>
    </div>
  );
};

export default Home;
