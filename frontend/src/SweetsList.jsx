// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";

const SweetsList = () => {
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
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const filteredSweets = sweets.filter((sweet) =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading sweets...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>Sweets</h2>
      <input
        type="text"
        placeholder="Search sweets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "16px",
          width: "100%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredSweets.map((sweet) => (
          <div
            key={sweet._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 2px 8px #eee",
            }}
          >
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
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h3>{sweet.name}</h3>
            <p>Price: ₹{sweet.price}</p>
            <p>Quantity: {sweet.quantity}</p>
            <button
              onClick={() => handlePurchase(sweet._id)}
              disabled={sweet.quantity === 0}
              style={{
                padding: "8px 16px",
                background: sweet.quantity === 0 ? "#ccc" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: sweet.quantity === 0 ? "not-allowed" : "pointer",
                marginTop: "10px",
              }}
            >
              {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SweetsList;
