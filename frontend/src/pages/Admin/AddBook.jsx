import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewBook } from "../../redux/bookSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/addBook.css";

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    publishYear: "",
    category: "",
    price: "",
    stock: "",
    format: "eBook",
    description: "",
    coverImage: null,
  });

  const [preview, setPreview] = useState(null); // For Cover Preview

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData({ ...bookData, coverImage: file });
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(bookData).forEach((key) => {
      if (key !== "coverImage") {
        formData.append(key, bookData[key]);
      }
    });

    if (bookData.coverImage) {
      formData.append("coverImage", bookData.coverImage);
    } else {
      alert("Please select a cover image!");
      return;
    }

    try {
      await dispatch(addNewBook(formData)).unwrap();
      alert("Book added successfully!");
      navigate("/admin/books");
    } catch (error) {
      console.error("❌ Error adding book:", error);
      alert("Failed to add book. Please check the input fields.");
    }
  };

  return (
    <div className="add-book-container">
      <h2 className="add-book-title">📖 Add New Book</h2>

      <form className="add-book-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={bookData.title}
          onChange={handleChange}
          required
        />

        <label>Author</label>
        <input
          type="text"
          name="author"
          value={bookData.author}
          onChange={handleChange}
          required
        />

        <label>Publish Year</label>
        <input
          type="number"
          name="publishYear"
          value={bookData.publishYear}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={bookData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="Business">Business</option>
          <option value="Self-Help">Self-Help</option>
          <option value="History">History</option>
          <option value="Romance">Romance</option>
          <option value="Thriller">Thriller</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Biography">Biography</option>
          <option value="Children">Children</option>
          <option value="Others">Others</option>
        </select>

        <label>Price ($)</label>
        <input
          type="number"
          name="price"
          value={bookData.price}
          onChange={handleChange}
          required
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={bookData.stock}
          onChange={handleChange}
          required
        />

        <label>Format</label>
        <select name="format" value={bookData.format} onChange={handleChange}>
          <option value="eBook">eBook</option>
          <option value="Hardcover">Hardcover</option>
          <option value="Paperback">Paperback</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          rows="4"
          value={bookData.description}
          onChange={handleChange}
        ></textarea>

        {/* Cover Preview */}
        {preview && (
          <div className="book-cover-preview">
            <img src={preview} alt="Book Cover" className="preview-image" />
          </div>
        )}

        {/* File Upload */}
        <label>Book Cover</label>
        <div className="file-input">
          <label className="file-label">
            📷 Upload Cover
            <input
              type="file"
              accept="image/*"
              name="coverImage"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>

        <button type="submit" className="add-book-btn">
          ➕ Add Book
        </button>
      </form>

      <a href="/admin/books" className="add-book-back">
        ⬅ Back to Manage Books
      </a>
    </div>
  );
};

export default AddBook;
