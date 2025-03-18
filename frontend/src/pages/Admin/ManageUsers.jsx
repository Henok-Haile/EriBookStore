import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  promoteUserToAdmin,
  deleteUserById,
} from "../../redux/userSlice";
import { Link } from "react-router-dom";
import "../../styles/admin.css";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user._id));
    }
  };

  const handlePromote = async (userId) => {
    if (window.confirm("Are you sure you want to make this user an admin?")) {
      dispatch(promoteUserToAdmin(userId))
        .unwrap()
        .then(() => dispatch(fetchAllUsers()))
        .catch((err) => console.error("❌ Error promoting user:", err));
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm("⚠️ Are you sure you want to delete this user?")) {
      dispatch(deleteUserById(userId)).then(() => dispatch(fetchAllUsers()));
    }
  };

  const handleBulkDelete = () => {
    if (
      selectedUsers.length > 0 &&
      window.confirm(`⚠️ Are you sure you want to delete ${selectedUsers.length} users?`)
    ) {
      selectedUsers.forEach((userId) => {
        dispatch(deleteUserById(userId));
      });
      setSelectedUsers([]);
      dispatch(fetchAllUsers());
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filterRole === "all" ||
        (filterRole === "admin" && user.isAdmin) ||
        (filterRole === "user" && !user.isAdmin)) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-container">
      <h2>👤 Manage Users</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Users</option>
          <option value="admin">Admins Only</option>
          <option value="user">Regular Users Only</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
              />
            </th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Registered On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan="7">No users found.</td>
            </tr>
          ) : (
            paginatedUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </td>
                <td>
                  <img
                    src={user.avatar || "/images/default-avatar.png"}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "✅" : "❌"}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {!user.isAdmin && (
                    <button className="btn-promote" onClick={() => handlePromote(user._id)}>
                      Make Admin
                    </button>
                  )}
                  <button className="btn-delete" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedUsers.length > 0 && (
        <button className="btn-bulk-delete" onClick={handleBulkDelete}>
          🗑 Delete {selectedUsers.length} Selected User(s)
        </button>
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next ▶
        </button>
      </div>

      <a href="/admin" className="admin-back">⬅ Back to Dashboard</a>
    </div>
  );
};

export default ManageUsers;
