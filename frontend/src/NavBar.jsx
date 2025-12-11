import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import {
  FaInfoCircle,
  FaBoxOpen,
  FaCreditCard,
  FaHeart,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./styles/navbar.css";

export default function NavBar() {
  const { token, logout, user } = useContext(AuthContext);
  const { count, items, removeItem } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const prevCount = useRef(count);
  const navigate = useNavigate();

  const getImage = (it) => {
    if (!it) return "https://via.placeholder.com/48";
    if (it.image?.startsWith("http")) return it.image;
    if (it.image) return `http://localhost:5000${it.image}`;
    if (it.imageUrl) return it.imageUrl;
    return "https://via.placeholder.com/48";
  };

  // Calculate total price
  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [items]);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.style.background = "#1a1a1a";
      document.body.style.color = "#fff";
    } else {
      document.body.style.background =
        "radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.65), transparent 30%), radial-gradient(circle at 85% 15%, rgba(255, 240, 235, 0.55), transparent 32%), radial-gradient(circle at 30% 70%, rgba(255, 230, 225, 0.45), transparent 36%), linear-gradient(180deg, #fff8f5 0%, #ffece4 60%, #ffe0d2 100%)";
      document.body.style.color = "#1f1f1f";
    }
  }, [darkMode]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".navbar")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-emoji">🍬</span>
          <span className="logo-text">SweetShop</span>
        </Link>
      </div>

      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setOpen((s) => !s)}
      >
        ☰
      </button>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        {/* Navigation Items */}
        <Link to="/sweets" className="nav-item" onClick={() => setOpen(false)}>
          <span className="nav-icon">
            <FaBoxOpen />
          </span>
          Sweets
        </Link>

        <Link to="/about" className="nav-item" onClick={() => setOpen(false)}>
          <span className="nav-icon">
            <FaInfoCircle />
          </span>
          About
        </Link>

        <Link
          to="/favorites"
          className="nav-item"
          onClick={() => setOpen(false)}
        >
          <span className="nav-icon">
            <FaHeart />
          </span>
          Favorites
        </Link>

        {/* Cart Dropdown */}
        <div
          className="cart-link"
          onMouseLeave={() => setMiniOpen(false)}
          onMouseEnter={() => setMiniOpen(true)}
        >
          <Link
            to="/cart"
            className="cart-trigger"
            onClick={() => {
              setOpen(false);
              setMiniOpen(false);
            }}
          >
            <span className="nav-icon">
              <FaBoxOpen />
            </span>
            My box
            {count > 0 && (
              <span
                className={`cart-badge ${pulse ? "pulse" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMiniOpen((s) => !s);
                }}
                title="Quick view box"
              >
                {count}
              </span>
            )}
          </Link>

          {miniOpen && (
            <div className="mini-cart" onMouseEnter={() => setMiniOpen(true)}>
              <div className="mini-cart-header">
                <span>🛒 My Box</span>
                <span className="mini-cart-total">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="mini-empty">
                  <div>Your box is empty</div>
                  <small>Add some sweets to get started!</small>
                </div>
              ) : (
                <>
                  <div className="mini-cart-items">
                    {items.slice(0, 5).map((it) => (
                      <div className="mini-item" key={it._id}>
                        <img src={getImage(it)} alt={it.name} />
                        <div className="mini-meta">
                          <div className="mini-name">{it.name}</div>
                          <div className="mini-qty">
                            Qty: {it.quantity} • ₹
                            {(it.price * it.quantity).toFixed(2)}
                          </div>
                        </div>
                        <button
                          className="mini-remove"
                          onClick={() => removeItem(it._id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mini-actions">
                    <Link
                      to="/cart"
                      className="mini-view"
                      onClick={() => setMiniOpen(false)}
                    >
                      View Box
                    </Link>
                    <Link
                      to="/checkout"
                      className="mini-checkout"
                      onClick={() => setMiniOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="nav-divider"></div>

        {/* Auth Group */}
        <div className="auth-group">
          {token && (
            <>
              <div className="status-indicator">
                <span className="status-dot"></span>
                Logged In
              </div>

              <Link
                to="/profile"
                className="user-profile-btn"
                onClick={() => setOpen(false)}
              >
                <div className="user-avatar">{userInitial}</div>
                <span>{user?.name?.split(" ")[0] || "User"}</span>
              </Link>

              <button
                className="nav-item"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.6rem 0.8rem",
                }}
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                title="Logout"
              >
                <span className="nav-icon">
                  <FaSignOutAlt />
                </span>
              </button>
            </>
          )}

          {!token && (
            <>
              <Link
                to="/login"
                className="nav-item nav-cta"
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">
                  <FaSignInAlt />
                </span>
                Login
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            className="nav-item"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.6rem 0.8rem",
              fontSize: "18px",
            }}
            onClick={() => setDarkMode((d) => !d)}
            title="Toggle theme"
          >
            <span className="nav-icon">
              {darkMode ? <FaSun /> : <FaMoon />}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
