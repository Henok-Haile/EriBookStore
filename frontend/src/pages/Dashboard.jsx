import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUser,
  FaClipboardList,
  FaHeart,
  FaShoppingCart,
  FaCogs,
  FaUsers,
  FaBook,
  FaClipboard,
} from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [adminOpen, setAdminOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redirect to Profile if no section is selected
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/profile");
    }
  }, [location, navigate]);

  // ✅ Determine Greeting Based on Time
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* ✅ Left Navigation Section */}
      <nav className="dashboard-left">
        <h3>
          {greeting}, {user?.name} 👋
        </h3>
        <ul>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUser /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/orders"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaClipboardList /> My Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/wishlist"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaHeart /> Wishlist
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/cart"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaShoppingCart /> Cart
            </NavLink>
          </li>

          {/* ✅ Admin Section (Only for Admins) */}
          {user?.isAdmin && (
            <>
              <li
                className="admin-title"
                onClick={() => setAdminOpen(!adminOpen)}
              >
                <FaCogs /> Admin Dashboard ▾
              </li>
              {adminOpen && (
                <ul className="admin-submenu">
                  <li>
                    <NavLink
                      to="/dashboard/manage-users"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      <FaUsers /> Manage Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manage-books"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      <FaBook /> Manage Books
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manage-orders"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      <FaClipboard /> Manage Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/manage-testimonials"
                      className={({ isActive }) =>
                        isActive ? "active-link" : ""
                      }
                    >
                      <FaClipboardList /> Manage Testimonals
                    </NavLink>
                  </li>
                </ul>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* ✅ Main Section - Displays Content Dynamically */}
      <main className="dashboard-main">
        <Outlet /> {/* ✅ Loads clicked section dynamically */}
      </main>
    </div>
  );
};

export default Dashboard;
