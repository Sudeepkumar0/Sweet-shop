import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import "./styles/adminNavbar.css";

export default function AdminNavBar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (onLogout) onLogout();
    navigate("/admin-login");
  };

  return (
    <header className="admin-navbar">
      <div className="admin-nav-left">
        <Link to="/admin" className="admin-logo">
          <span className="admin-logo-emoji">🛡️</span>
          <span className="admin-logo-text">Admin Panel</span>
        </Link>
      </div>

      <nav className="admin-nav-links">
        <a href="#products" className="admin-nav-item">
          <span className="admin-nav-icon">
            <FaBoxOpen />
          </span>
          Products
        </a>
        <a href="#users" className="admin-nav-item">
          <span className="admin-nav-icon">
            <FaUsers />
          </span>
          Users
        </a>
        <Link to="/" className="admin-nav-item">
          <span className="admin-nav-icon">
            <FaHome />
          </span>
          View Site
        </Link>
        <button
          className="admin-nav-item admin-logout-btn"
          onClick={handleLogout}
        >
          <span className="admin-nav-icon">
            <FaSignOutAlt />
          </span>
          Logout
        </button>
      </nav>
    </header>
  );
}
