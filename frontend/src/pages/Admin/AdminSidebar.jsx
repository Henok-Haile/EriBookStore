import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaBook, FaClipboardList, FaArrowLeft } from "react-icons/fa";
import "../../styles/AdminSidebar.css"; // ✅ Apply styling

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li>
          <NavLink to="manage-users" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FaUsers /> Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink to="manage-books" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FaBook /> Manage Books
          </NavLink>
        </li>
        <li>
          <NavLink to="manage-orders" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FaClipboardList /> Manage Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="manage-testimonals" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FaClipboardList /> Manage Testimonals
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
            <FaArrowLeft /> Back to Home
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
