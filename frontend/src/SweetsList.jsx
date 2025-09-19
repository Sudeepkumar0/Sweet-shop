// ...existing code...
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./styles/sweetslist.css";

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
              <button
                onClick={() => handlePurchase(sweet._id)}
                disabled={sweet.quantity === 0}
                className="sweetCardButton"
                style={{
                  background: sweet.quantity === 0 ? "#ccc" : "#f55095ff",
                  cursor: sweet.quantity === 0 ? "not-allowed" : "pointer",
                }}
              >
                {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SweetsList;
