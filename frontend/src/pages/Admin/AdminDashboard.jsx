
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ManageBooks from "./ManageBooks";
import ManageUsers from "./ManageUsers";
import ManageOrders from "./ManageOrders";
import ManageTestimonials from "./ManageTestimonials";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="books" />} /> {/* Default to Books */}
          <Route path="books" element={<ManageBooks />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="testimonials" element={<ManageTestimonials />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

