import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

// Helper to resolve image URLs
const resolveImageUrl = (url) => {
  if (!url) return "/snaps/placeholder.png";
  if (url.startsWith("/uploads")) return `http://localhost:5000${url}`;
  if (url.startsWith("http")) return url;
  return url;
};

export default function MyOrders() {
  const { token } = useContext(AuthContext) || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/my`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <section style={{ background: "#fff9f8", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            border: "1px solid #e8ddd8",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Order #{o._id.slice(-6)}</strong>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <div style={{ marginTop: 8, color: "#555" }}>
            Status: <strong style={{ color: "#333" }}>{o.status}</strong>
          </div>
          <div style={{ marginTop: 8 }}>
            {o.items &&
              o.items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0e9e6",
                  }}
                >
                  <img
                    src={resolveImageUrl(it.image)}
                    alt={it.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #eee",
                      background: "#fff",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/snaps/placeholder.png";
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div style={{ color: "#777", fontSize: 13 }}>
                      Qty: {it.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    ₹{(it.price * it.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 16,
              marginTop: 8,
              color: "#333",
            }}
          >
            <span>Subtotal: ₹{Number(o.subtotal).toFixed(2)}</span>
            <span>Tax: ₹{Number(o.tax).toFixed(2)}</span>
            <strong>Total: ₹{Number(o.total).toFixed(2)}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}
