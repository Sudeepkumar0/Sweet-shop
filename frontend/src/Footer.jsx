import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaShieldAlt,
  FaShippingFast,
  FaClock,
  FaArrowUp,
  FaStar,
  FaCreditCard,
} from "react-icons/fa";
import "./styles/footer.css";

const galleryItems = [
  { emoji: "🍩", label: "Donuts", hue: "var(--sweet-pink)" },
  { emoji: "🍪", label: "Cookies", hue: "var(--sweet-gold)" },
  { emoji: "🧁", label: "Cupcakes", hue: "var(--sweet-lavender)" },
  { emoji: "🍫", label: "Chocolates", hue: "var(--sweet-cocoa)" },
  { emoji: "🍰", label: "Cakes", hue: "var(--sweet-rose)" },
  { emoji: "🍦", label: "Icecream", hue: "var(--sweet-sky)" },
];

export default function Footer() {
  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.elements.newsletter?.value;
    if (email) {
      console.log("Subscribed:", email);
      e.target.reset();
    }
  };

  return (
    <footer className="footer">
      <div className="footer-cta">
        <div>
          <p className="footer-cta-title">Get sweet deals in your inbox</p>
          <p className="footer-cta-sub">
            Exclusive offers, new arrivals, and seasonal drops.
          </p>
        </div>
        <form className="footer-cta-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            name="newsletter"
            placeholder="Enter your email"
            aria-label="Email for sweet deals"
            required
          />
          <button type="submit">Get sweet deals</button>
        </form>
      </div>

      <div className="footer-body">
        <div className="footer-col">
          <div className="footer-brand">
            <div className="footer-logo">🍬 SweetShop</div>
            <p className="footer-tagline">
              Handcrafted sweets, delivered fresh and fast.
            </p>
          </div>
          <div className="footer-metrics">
            <span>
              <FaStar /> 10k+ happy customers
            </span>
            <span>
              <FaShippingFast /> Pan-India shipping
            </span>
            <span>
              <FaClock /> Freshly made daily
            </span>
          </div>
          <div className="footer-trust">
            <span>
              <FaShieldAlt /> Secure checkout
            </span>
            <span>
              <FaCreditCard /> UPI / Cards / Netbanking
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/sweets">Sweets</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">My Box</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <a href="tel:+918888888888">
            <FaPhoneAlt /> +91 88888 88888
          </a>
          <a href="mailto:hello@sweetshop.com">
            <FaEnvelope /> hello@sweetshop.com
          </a>
          <span>
            <FaMapMarkerAlt /> Bengaluru, India
          </span>
          <span>
            <FaClock /> 9:00 AM - 9:00 PM
          </span>
          <div className="footer-support-actions">
            <a
              href="https://wa.me/918888888888"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="mailto:support@sweetshop.com">
              <FaEnvelope /> Email
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Stay connected</h4>
          <div className="footer-social">
            <a href="https://instagram.com" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
          <div className="footer-gallery">
            {galleryItems.map((item) => (
              <div
                className="footer-thumb"
                key={item.label}
                style={{ background: item.hue }}
              >
                <span className="thumb-emoji">{item.emoji}</span>
                <span className="thumb-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-policies">
          <Link to="/about">Privacy Policy</Link>
          <Link to="/about">Terms of Service</Link>
          <Link to="/about">Refund Policy</Link>
          <Link to="/about">Shipping</Link>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} SweetShop. Crafted with ❤️.
        </div>
      </div>

      <button
        className="footer-top"
        onClick={handleTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
}
