import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBookDetails, updateBookById } from "../../redux/bookSlice";
import "../../styles/EditBook.css"; // ✅ Using the same styling as AddBook

const EditBook = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookDetails, loading } = useSelector((state) => state.books);

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

  useEffect(() => {
    dispatch(fetchBookDetails(bookId)); // ✅ Fetch book details when component mounts
  }, [dispatch, bookId]);

  useEffect(() => {
    if (bookDetails) {
      setBookData({
        title: bookDetails.title || "",
        author: bookDetails.author || "",
        publishYear: bookDetails.publishYear || "",
        category: bookDetails.category || "",
        price: bookDetails.price || "",
        stock: bookDetails.stock || "",
        format: bookDetails.format || "eBook",
        description: bookDetails.description || "",
        coverImage: bookDetails.coverImage || null,
      });
    }
  }, [bookDetails]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBookData({ ...bookData, coverImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    for (let key in bookData) {
      formData.append(key, bookData[key]);
    }

    dispatch(updateBookById({ bookId, updatedData: formData }))
      .unwrap()
      .then(() => {
        navigate("/admin/books");
      });
  };

  if (loading) return <p>Loading book details...</p>;

  return (
    <div className="add-book-container">
      <h2 className="add-book-title">✏️ Edit Book</h2>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" value={bookData.title} onChange={handleChange} required />

        <label>Author</label>
        <input type="text" name="author" value={bookData.author} onChange={handleChange} required />

        <label>Publish Year</label>
        <input type="number" name="publishYear" value={bookData.publishYear} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={bookData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Science">Science</option>
          <option value="Business">Business</option>
        </select>

        <label>Price ($)</label>
        <input type="number" name="price" value={bookData.price} onChange={handleChange} required />

        <label>Stock</label>
        <input type="number" name="stock" value={bookData.stock} onChange={handleChange} required />

        <label>Format</label>
        <select name="format" value={bookData.format} onChange={handleChange}>
          <option value="eBook">eBook</option>
          <option value="Hardcover">Hardcover</option>
          <option value="Paperback">Paperback</option>
        </select>

        <label>Description</label>
        <textarea name="description" rows="4" value={bookData.description} onChange={handleChange}></textarea>

        {/* ✅ Book Cover Preview */}
        {bookData.coverImage && (
          <div className="book-cover-preview">
            <img 
              src={typeof bookData.coverImage === "string" ? bookData.coverImage : URL.createObjectURL(bookData.coverImage)} 
              alt="Book Cover" 
              className="preview-image" 
            />
          </div>
        )}

        {/* ✅ File Upload */}
        <label>Update Cover</label>
        <div className="file-input">
          <label className="file-label">
            📷 Upload New Cover
            <input type="file" accept="image/*" name="coverImage" onChange={handleFileChange} />
          </label>
        </div>

        <button type="submit" className="add-book-btn">Save Changes</button>
      </form>

      <a href="/admin/books" className="add-book-back">⬅ Back to Manage Books</a>
    </div>
  );
};

export default EditBook;
