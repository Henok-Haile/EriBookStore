import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../redux/bookSlice";
import { fetchCategories } from "../api/books";
import { addBookToWishlist } from "../redux/wishlistSlice";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/BookList.css";

const BookList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books || []); // ✅ Ensure books is an array
  const totalBooks = useSelector((state) => state.books.totalBooks || 0); // ✅ Get total books
  const { token } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // ✅ Fetch books with category & pagination
  useEffect(() => {
    const query = { category: selectedCategory, page: currentPage, search };
    console.log("🔍 Fetching books with query:", query);
    dispatch(fetchBooks(query));
  }, [dispatch, selectedCategory, currentPage, search]);

  // ✅ Fetch Categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    getCategories();
  }, []);

  // ✅ Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(fetchBooks({ category: selectedCategory, page: 1, search }));
  };

  // ✅ Handle Category Selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    dispatch(fetchBooks({ category, page: 1, search }));
  };

  // ✅ Handle Sorting
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);

    let sortedBooks = [...books];

    switch (e.target.value) {
      case "priceLowHigh":
        sortedBooks.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        sortedBooks.sort((a, b) => b.price - a.price);
        break;
      case "ratingHighLow":
        sortedBooks.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "ratingLowHigh":
        sortedBooks.sort((a, b) => a.averageRating - b.averageRating);
        break;
      case "mostPopular":
        sortedBooks.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case "newest":
        sortedBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        sortedBooks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "discounted":
        sortedBooks = sortedBooks.filter((book) => book.discount > 0);
        break;
      default:
        break;
    }

    // dispatch({ type: "books/setSortedBooks", payload: sortedBooks });
    dispatch(fetchBooks({ category: selectedCategory, page: currentPage, sortBy: newSort }));
  };

  // ✅ Handle Wishlist Add
  const handleAddToWishlist = (bookId) => {
    if (!token) {
      toast.warn("🔒 Please login to add to your wishlist!");
      return;
    }
    dispatch(addBookToWishlist(bookId));
    toast.success("💖 Book added to wishlist!");
  };

  // ✅ Pagination Logic
  const totalPages = Math.max(1, Math.ceil(totalBooks / booksPerPage));
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="booklist-container">
      <h2 className="text-center">📚 Browse Books</h2>

      {/* ✅ Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {/* ✅ Filters Section */}
      <div className="filters-container">
        <select className="filter-dropdown" value={selectedCategory} onChange={(e) => handleCategorySelect(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

         {/* ✅ Ensure Sorting Dropdown is Visible */}
  <select className="filter-dropdown" value={sortBy} onChange={handleSortChange}>
    <option value="">Sort By</option>
    <option value="priceLowHigh">Price: Low to High</option>
    <option value="priceHighLow">Price: High to Low</option>
    <option value="ratingHighLow">Best Rated</option>
    <option value="ratingLowHigh">Lowest Rated</option>
    <option value="mostPopular">Most Popular</option>
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="discounted">Discounted Books</option>
  </select>
      </div>

      {/* ✅ Book Grid */}
      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img src={book.coverImage || "/images/default-book.jpg"} alt={book.title} />
            <h5>{book.title}</h5>
            <p>{book.author}</p>
            <button className="wishlist-btn" onClick={() => handleAddToWishlist(book._id)}>
              <FaHeart className="wishlist-icon" />
            </button>
            <Link to={`/books/${book._id}`} className="btn-primary">View Details</Link>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>⬅ Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next ➡</button>
        </div>
      )}
    </div>
  );
};

export default BookList;
