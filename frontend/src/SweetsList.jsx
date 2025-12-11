import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShare,
} from "react-icons/fa";
import axios from "axios";
import "./styles/sweetslist.css";
import { CartContext } from "./CartContext";

function RatingDisplay({ rating = 4.5, reviewCount = 0 }) {
  return (
    <div className="rating-container">
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={12}
            color={i < Math.floor(rating) ? "#FFD700" : "#ddd"}
          />
        ))}
      </div>
      <span className="rating-text">({reviewCount})</span>
    </div>
  );
}

function StockStatus({ quantity }) {
  let status, color;
  if (quantity === 0) {
    status = "Out of Stock";
    color = "#d32f2f";
  } else if (quantity <= 5) {
    status = "Low Stock";
    color = "#f57c00";
  } else {
    status = "In Stock";
    color = "#388e3c";
  }
  return (
    <div className="stock-status" style={{ color }}>
      <div className="stock-dot" style={{ backgroundColor: color }}></div>
      {status}
    </div>
  );
}

function FavoriteIcon({ sweetId }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem("sweetshop_favs");
        const favs = raw ? JSON.parse(raw) : [];
        setFav(favs.includes(sweetId));
      } catch (e) {
        // ignore
      }
    };
    read();
    window.addEventListener("favoritesUpdated", read);
    return () => window.removeEventListener("favoritesUpdated", read);
  }, [sweetId]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem("sweetshop_favs");
      const favs = raw ? JSON.parse(raw) : [];
      const next = favs.includes(sweetId)
        ? favs.filter((id) => id !== sweetId)
        : [...favs, sweetId];
      localStorage.setItem("sweetshop_favs", JSON.stringify(next));
      window.dispatchEvent(new Event("favoritesUpdated"));
      setFav(next.includes(sweetId));
    } catch (e) {
      // ignore
    }
  };

  return (
    <button
      onClick={toggle}
      className="fav-icon"
      style={{ background: "transparent", border: "none" }}
    >
      {fav ? (
        <FaHeart color="#ff6b95" size={18} />
      ) : (
        <FaRegHeart color="#666" size={18} />
      )}
    </button>
  );
}

function QuickViewModal({ sweet, isOpen, onClose }) {
  if (!isOpen || !sweet) return null;

  const image = sweet.image
    ? `http://localhost:5000${sweet.image}`
    : "https://via.placeholder.com/150";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-body">
          <img src={image} alt={sweet.name} className="modal-image" />
          <div className="modal-info">
            <h2>{sweet.name}</h2>
            <p className="modal-price">₹{sweet.price}</p>
            <RatingDisplay rating={4.5} reviewCount={12} />
            <StockStatus quantity={sweet.quantity} />
            <p className="modal-description">
              {sweet.description || "Premium quality sweet product."}
            </p>
            <p className="modal-delivery">📦 Free delivery available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddToBoxButton({ sweet }) {
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const image = sweet.image
    ? `http://localhost:5000${sweet.image}`
    : "https://via.placeholder.com/100";

  const handleAdd = () => {
    if (sweet.quantity === 0) {
      alert("This item is out of stock");
      return;
    }
    if (quantity > sweet.quantity) {
      alert(`Only ${sweet.quantity} items available in stock`);
      return;
    }
    const ok = addItem({
      _id: sweet._id,
      name: sweet.name,
      price: sweet.price,
      image,
      quantity: quantity,
      availableStock: sweet.quantity,
    });
    if (!ok) {
      const go = window.confirm("Please login to add items. Go to login?");
      if (go) navigate("/login");
      return;
    }
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="add-to-box-container">
      <div className="quantity-selector">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="qty-btn"
          disabled={quantity === 1 || sweet.quantity === 0}
        >
          −
        </button>
        <span className="qty-display">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
          className="qty-btn"
          disabled={quantity >= sweet.quantity || sweet.quantity === 0}
          title={
            quantity >= sweet.quantity ? `Only ${sweet.quantity} available` : ""
          }
        >
          +
        </button>
      </div>
      <button
        onClick={handleAdd}
        disabled={sweet.quantity === 0}
        className={`addBoxButton ${added ? "added" : ""}`}
        style={{
          background: sweet.quantity === 0 ? "#ddd" : "#f55095ff",
          cursor: sweet.quantity === 0 ? "not-allowed" : "pointer",
        }}
      >
        {sweet.quantity === 0
          ? "Out of Stock"
          : added
          ? "✓ Added!"
          : "Add to Box"}
      </button>
    </div>
  );
}

function SweetsList() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewSweet, setQuickViewSweet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [bannerImageIndex, setBannerImageIndex] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await axios.get("/api/sweets");
        setSweets(res.data || []);
      } catch (err) {
        console.error("Error fetching sweets:", err);
        setError("Failed to fetch sweets");
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  // Rotate banner images every 5 seconds
  useEffect(() => {
    if (sweets.length === 0) return;

    const interval = setInterval(() => {
      setBannerImageIndex((prev) => (prev + 1) % sweets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sweets]);

  const categories = useMemo(() => {
    const cats = ["All"];
    if (Array.isArray(sweets)) {
      sweets.forEach((sweet) => {
        if (sweet.category && !cats.includes(sweet.category)) {
          cats.push(sweet.category);
        }
      });
    }
    return cats;
  }, [sweets]);

  const processedSweets = useMemo(() => {
    let result = Array.isArray(sweets) ? [...sweets] : [];

    if (search) {
      result = result.filter((sweet) =>
        sweet.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((sweet) => sweet.category === selectedCategory);
    }

    result = result.filter(
      (sweet) => sweet.price >= priceRange[0] && sweet.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = result.sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        result = result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return result;
  }, [sweets, search, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(processedSweets.length / itemsPerPage);
  const paginatedSweets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedSweets.slice(startIdx, startIdx + itemsPerPage);
  }, [processedSweets, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, 1000]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="main">
        <div className="skeleton-loader">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-item"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="main">
      <section
        className="hero-banner"
        style={{
          backgroundImage:
            sweets.length > 0 && sweets[bannerImageIndex]?.image
              ? `url('http://localhost:5000${sweets[bannerImageIndex].image}')`
              : "none",
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">Sweet Shop</h1>
          <p className="hero-tagline">
            Discover the finest sweets & confections
          </p>
          <p className="hero-promotion">
            🎉 Free delivery on orders above ₹500!
          </p>
        </div>
      </section>

      <div className="search-sticky-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search sweets..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => {
                  setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]);
                  setCurrentPage(1);
                }}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([
                    priceRange[0],
                    parseInt(e.target.value) || 1000,
                  ]);
                  setCurrentPage(1);
                }}
                className="price-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={resetFilters}>
            Clear Filters
          </button>
        </div>
      )}

      <div className="results-info">
        <span className="result-count">
          Showing {paginatedSweets.length} of {processedSweets.length} results
        </span>
      </div>

      {processedSweets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍬</div>
          <h2>No sweets found</h2>
          <p>Try adjusting your filters or search terms</p>
          <button className="empty-reset-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="main-grid">
            {paginatedSweets.map((sweet) => (
              <div
                className={`sweet-card ${
                  sweet.quantity === 0 ? "out-of-stock" : ""
                }`}
                key={sweet._id}
              >
                <div className="sweet-image-container">
                  <img
                    src={
                      sweet.image
                        ? `http://localhost:5000${sweet.image}`
                        : "https://via.placeholder.com/200"
                    }
                    alt={sweet.name}
                    className="sweet-image"
                    loading="lazy"
                  />
                  {sweet.quantity === 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                  <div className="card-overlay">
                    <button
                      className="quick-view-btn"
                      onClick={() => setQuickViewSweet(sweet)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="sweet-content">
                  <div className="sweet-header">
                    <h3 className="sweet-name">{sweet.name}</h3>
                    <FavoriteIcon sweetId={sweet._id} />
                  </div>

                  <p className="sweet-description">
                    {sweet.description
                      ? sweet.description.substring(0, 50) + "..."
                      : "Premium quality sweet"}
                  </p>

                  <RatingDisplay rating={4.5} reviewCount={12} />
                  <StockStatus quantity={sweet.quantity} />

                  <div className="sweet-price-section">
                    <span className="sweet-price">₹{sweet.price}</span>
                    <button className="share-btn" title="Share">
                      <FaShare size={14} />
                    </button>
                  </div>

                  <AddToBoxButton sweet={sweet} />

                  <p className="delivery-info">📦 Free delivery</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-num ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <QuickViewModal
        sweet={quickViewSweet}
        isOpen={!!quickViewSweet}
        onClose={() => setQuickViewSweet(null)}
      />
    </div>
  );
}

export default SweetsList;
