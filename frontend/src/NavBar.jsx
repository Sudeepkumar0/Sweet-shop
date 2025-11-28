import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import "./styles/navbar.css";

export default function NavBar() {
  const { token, logout } = useContext(AuthContext);
  const { count, items, removeItem } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [miniOpen, setMiniOpen] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

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
        {/* Home link removed per user request */}
        <Link to="/sweets" className="nav-item" onClick={() => setOpen(false)}>
          Sweets
        </Link>
        <Link to="/about" className="nav-item" onClick={() => setOpen(false)}>
          About
        </Link>
        <div
          className="nav-item cart-link"
          onMouseLeave={() => setMiniOpen(false)}
        >
          <Link
            to="/cart"
            onClick={() => {
              setOpen(false);
              setMiniOpen(false);
            }}
            className="nav-item"
          >
            My box
            {count > 0 && (
              <span
                className={`cart-badge ${pulse ? "pulse" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMiniOpen((s) => !s);
                }}
              >
                {count}
              </span>
            )}
          </Link>

          {miniOpen && (
            <div className="mini-cart" onMouseEnter={() => setMiniOpen(true)}>
              {items.length === 0 ? (
                <div className="mini-empty">Your box is empty</div>
              ) : (
                <div>
                  {items.slice(0, 5).map((it) => (
                    <div className="mini-item" key={it._id}>
                      <img
                        src={
                          it.image
                            ? `http://localhost:5000${it.image}`
                            : it.imageUrl || "https://via.placeholder.com/48"
                        }
                        alt={it.name}
                      />
                      <div className="mini-meta">
                        <div className="mini-name">{it.name}</div>
                        <div className="mini-qty">Qty: {it.quantity}</div>
                      </div>
                      <button
                        className="mini-remove"
                        onClick={() => removeItem(it._id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
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
                </div>
              )}
            </div>
          )}
        </div>
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

        <Link to="/contact" className="nav-item" onClick={() => setOpen(false)}>
          Contact
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
