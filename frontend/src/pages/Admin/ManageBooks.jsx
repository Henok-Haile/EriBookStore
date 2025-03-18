import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks, approveBookById, deleteBookById } from "../../redux/bookSlice";
import { Link } from "react-router-dom";
import "../../styles/admin.css";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageBooks = () => {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const handleApprove = (bookId) => {
    dispatch(approveBookById(bookId));
  };

  const handleDelete = (bookId) => {
    dispatch(deleteBookById(bookId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-container">
      <h2>📚 Manage Books</h2>
      <Link to="/admin/add-book" className="btn-approve">➕ Add New Book</Link>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isApproved ? "✅" : "❌"}</td>
              <td>
                {!book.isApproved && (
                  <button className="btn-approve" onClick={() => handleApprove(book._id)}>
                    Approve
                  </button>
                )}
                <Link to={`/admin/edit-book/${book._id}`} className="btn-edit">✏️ Edit</Link>
                <button className="btn-delete" onClick={() => handleDelete(book._id)}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/admin" className="admin-back">⬅ Back to Dashboard</a>
    </div>
  );
};

export default ManageBooks;
