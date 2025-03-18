import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart"; // Create this file next
import Dashboard from "./pages/Dashboard"; // Admin Dashboard
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route
import AdminDashboard from "./pages/Admin/AdminDashboard"; // Create this next
import ManageBooks from "./pages/Admin/ManageBooks"; // Admin: Manage Books
import ManageOrders from "./pages/Admin/ManageOrders"; // Admin: Manage Orders
import ManageUsers from "./pages/Admin/ManageUsers"; // Admin: Manage Users
import ManageTestimonials from "./pages/Admin/ManageTestimonials";

import AddBook from "./pages/Admin/AddBook";
import EditBook from "./pages/Admin/EditBook";
import Footer from "./components/Footer";
import BookList from "./pages/BookList";
import BookDetails from "./pages/BookDetails";

import Profile from "./pages/Dashboard/Profile";
import OrderHistory from "./pages/Dashboard/OrderHistory";
import CartOverview from "./pages/Dashboard/CartOverview";
import OrderSuccess from "./pages/OrderSuccess"; // ✅ Import Success Page
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Wishlist from "./pages/Wishlist"; // Create this file next

import Unsubscribe from "./pages/Unsubscribe";

const App = () => {
  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar /> {/* ✅ Navbar always visible */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unsubscribe/:token" element={<Unsubscribe />} />
          {/* ✅ Book Routes */}
          <Route path="/books" element={<BookList />} />{" "}
          {/* 📚 Show all books */}
          {/* 📖 Show book details */}
          <Route path="/books/:id" element={<BookDetails />} />{" "}
          {/* Protected Routes - Only logged-in users can access */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />}>
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="cart" element={<CartOverview />} />

              {/* ✅ Admin Routes (Under Admin Dashboard) */}
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-books" element={<ManageBooks />} />
              <Route path="manage-orders" element={<ManageOrders />} />
              <Route path="manage-testimonials" element={<ManageTestimonials />} />
            </Route>

            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* ✅ Admin Dashboard Route */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
          {/* 🔹 Admin Routes (Only admins can access) */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<ManageBooks />} />
            <Route path="/admin/add-book" element={<AddBook />} />
            <Route path="/admin/edit-book/:bookId" element={<EditBook />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
