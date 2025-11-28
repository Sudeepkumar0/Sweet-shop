// ...existing code...
import React, { useEffect, useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./styles/sweetslist.css";
import { CartContext } from "./CartContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function AddToBoxButton({ sweet }) {
  const { addItem } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const image = sweet.image
    ? `http://localhost:5000${sweet.image}`
    : sweet.imageUrl || "";

  const handleAdd = () => {
    if (sweet.quantity === 0) return;
    addItem({
      _id: sweet._id,
      name: sweet.name,
      price: sweet.price,
      image,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={sweet.quantity === 0}
      className={`addBoxButton ${added ? "added" : ""}`}
      style={{
        background: sweet.quantity === 0 ? "#ddd" : "#f55095ff",
        cursor: sweet.quantity === 0 ? "not-allowed" : "pointer",
        width: 110,
        border: "none",
        borderRadius: 6,
        fontWeight: 600,
        transition: "transform 220ms ease, box-shadow 220ms ease",
      }}
    >
      {added ? "Added" : "Add to Box"}
    </button>
  );
}

function FavoriteIcon({ sweetId }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sweetshop_favs");
      const favs = raw ? JSON.parse(raw) : [];
      setFav(favs.includes(sweetId));
    } catch (e) {
      setFav(false);
    }
  }, [sweetId]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem("sweetshop_favs");
      const favs = raw ? JSON.parse(raw) : [];
      let next;
      if (favs.includes(sweetId)) {
        next = favs.filter((id) => id !== sweetId);
        setFav(false);
      } else {
        next = [...favs, sweetId];
        setFav(true);
      }
      localStorage.setItem("sweetshop_favs", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="favorite"
      className="fav-icon"
      style={{ background: "transparent", border: "none" }}
    >
      {fav ? <FaHeart color="#ff6b95" /> : <FaRegHeart color="#666" />}
    </button>
  );
}

const SweetsList = () => {
  const [purchaseAlert, setPurchaseAlert] = useState("");
  const [purchaseMsg, setPurchaseMsg] = useState({});
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await axios.get("/api/sweets");
        setSweets(res.data);
      } catch (err) {
        setError("Failed to fetch sweets");
      } finally {
        setLoading(false);
      }
    };
    fetchSweets();
  }, []);

  const handlePurchase = async (sweetId) => {
    try {
      await axios.post("/api/inventory/purchase", { sweetId, quantity: 1 });
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === sweetId
            ? { ...sweet, quantity: sweet.quantity - 1 }
            : sweet
        )
      );
      const purchasedSweet = sweets.find((sweet) => sweet._id === sweetId);
      const newQty = purchasedSweet ? purchasedSweet.quantity - 1 : 0;
      setPurchaseAlert(`Purchased! Remaining quantity: ${newQty}`);
      setTimeout(() => setPurchaseAlert(""), 2000);
    } catch (err) {
      setPurchaseAlert(err.response?.data?.message || "Purchase failed");
      setTimeout(() => setPurchaseAlert(""), 2000);
    }
  };

  const filteredSweets = sweets.filter((sweet) =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading sweets...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="main">
      {purchaseAlert && <div className="purcahseAlert">{purchaseAlert}</div>}
      <header className="header">
        <h1 className="heading">Sweet Shop</h1>
      </header>
      <div className="searchDiv">
        <div style={{ position: "relative", width: "50%" }}>
          <FaSearch className="FaSearch" />
          <input
            type="text"
            placeholder="Search sweets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
        </div>
      </div>
      <div className="mainGrid">
        {filteredSweets.map((sweet) => (
          <div className="sweetDiv" key={sweet._id}>
            <img
              src={
                sweet.image
                  ? `http://localhost:5000${sweet.image}`
                  : sweet.imageUrl
                  ? sweet.imageUrl
                  : "https://via.placeholder.com/150"
              }
              alt={sweet.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3>{sweet.name}</h3>
              <p style={{ fontSize: "12px" }}>Price: ₹{sweet.price}</p>
              {/* <p>Quantity: {sweet.quantity}</p> */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <AddToBoxButton sweet={sweet} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FavoriteIcon sweetId={sweet._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SweetsList;
