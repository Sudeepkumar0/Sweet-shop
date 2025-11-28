import React, { useContext } from "react";
import { CartContext } from "./CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, clear } = useContext(CartContext);

  const total = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  if (!items || items.length === 0)
    return (
      <main style={{ padding: "1rem" }}>
        <h2>My box</h2>
        <p>Your box is empty.</p>
      </main>
    );

  return (
    <main style={{ padding: "1rem" }}>
      <h2>My box</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li
            key={it._id}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <img
              src={it.image || "https://via.placeholder.com/80"}
              alt={it.name}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div style={{ fontSize: 13, color: "#666" }}>
                ₹{it.price} • Qty:
                <button
                  onClick={() =>
                    updateQty(it._id, Math.max(1, (it.quantity || 1) - 1))
                  }
                  style={{ marginLeft: 8 }}
                >
                  -
                </button>
                <span style={{ margin: "0 8px" }}>{it.quantity}</span>
                <button
                  onClick={() => updateQty(it._id, (it.quantity || 1) + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>
                ₹{(it.price * (it.quantity || 1)).toFixed(2)}
              </div>
              <button
                onClick={() => removeItem(it._id)}
                style={{
                  marginTop: 6,
                  color: "#c00",
                  background: "transparent",
                  border: "none",
                }}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          Total: ₹{total.toFixed(2)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => clear()} style={{ padding: "8px 12px" }}>
            Clear
          </button>
          <a
            href="/checkout"
            className="btn-primary"
            style={{
              padding: "8px 12px",
              textDecoration: "none",
              background: "#ff6b95",
              color: "#fff",
              borderRadius: 6,
            }}
          >
            Checkout
          </a>
        </div>
      </div>
    </main>
  );
}
