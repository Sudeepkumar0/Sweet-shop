import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./styles/navbar.css";

export default function NavBar() {
  const { token, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

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
        <Link to="/" className="nav-item" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link to="/sweets" className="nav-item" onClick={() => setOpen(false)}>
          Sweets
        </Link>
        <Link to="/about" className="nav-item" onClick={() => setOpen(false)}>
          About
        </Link>
        <Link to="/cart" className="nav-item" onClick={() => setOpen(false)}>
          My box
        </Link>
        <Link
          to="/checkout"
          className="nav-item"
          onClick={() => setOpen(false)}
        >
          Checkout
        </Link>
        <Link
          to="/favorites"
          className="nav-item"
          onClick={() => setOpen(false)}
        >
          Favorites
        </Link>

        {token ? (
          <button
            className="nav-item nav-cta"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="nav-item nav-cta"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
