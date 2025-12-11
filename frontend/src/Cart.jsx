import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import "./styles/cart.css";

export default function Cart() {
  const { items, removeItem, updateQty, clear } = useContext(CartContext);
  const [removingIds, setRemovingIds] = useState([]);

  function handleRemove(id) {
    if (removingIds.includes(id)) return;
    setRemovingIds((s) => [...s, id]);
    // allow animation to play before removing from context
    setTimeout(() => {
      removeItem(id);
      setRemovingIds((s) => s.filter((x) => x !== id));
    }, 240);
  }

  const total = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  return (
    <main className="cart-page">
      <div className="cart-wrap">
        <section className="cart-left">
          <h2>My box</h2>

          <div className="cart-table">
            <div className="cart-row cart-head">
              <div className="col col-product">Product</div>
              <div className="col col-remove"></div>
              <div className="col col-price">Price</div>
              <div className="col col-qty">Quantity</div>
              <div className="col col-total">Total</div>
            </div>

            {(!items || items.length === 0) && (
              <div className="empty">Your box is empty.</div>
            )}

            {items &&
              items.map((it) => (
                <div
                  className={`cart-row ${
                    removingIds.includes(it._id) ? "removing" : ""
                  }`}
                  key={it._id}
                >
                  <div className="col col-product">
                    <img
                      src={
                        it.image
                          ? `http://localhost:5000${it.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={it.name}
                      className="prod-thumb"
                    />
                    <div className="prod-meta">
                      <div className="prod-name">{it.name}</div>
                      <div className="prod-desc">₹{it.price}</div>
                      <button
                        className="text-remove mobile-remove"
                        onClick={() => handleRemove(it._id)}
                        aria-label="Remove item"
                      >
                        {/* small text fallback for mobile */}
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="col col-remove">
                    <button
                      className="text-remove"
                      onClick={() => handleRemove(it._id)}
                      aria-label="Remove item"
                    >
                      <svg
                        className="remove-icon"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M3 6h18"
                          stroke="#ff6b95"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
                          stroke="#ff6b95"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 11v6"
                          stroke="#ff6b95"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 11v6"
                          stroke="#ff6b95"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 6l1-2h4l1 2"
                          stroke="#ff6b95"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="col col-price">₹{it.price}</div>

                  <div className="col col-qty">
                    <div className="qty-control">
                      <button
                        onClick={() =>
                          updateQty(it._id, Math.max(1, (it.quantity || 1) - 1))
                        }
                      >
                        -
                      </button>
                      <span>{it.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(it._id, (it.quantity || 1) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col col-total">
                    <div className="row-total">
                      ₹{(it.price * (it.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <aside className="cart-right">
          <div className="summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items</span>
              <span>{items.length}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button
                className="checkout-btn"
                onClick={() => (window.location.href = "/checkout")}
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
