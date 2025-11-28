import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/favorites.css";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("sweetshop_favs");
      const favs = raw ? JSON.parse(raw) : [];
      if (!favs || favs.length === 0) {
        setItems([]);
        return;
      }
      const res = await axios.get("/api/sweets");
      const sweets = res.data || [];
      const filtered = sweets.filter((s) => favs.includes(s._id));
      setItems(filtered);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("favoritesUpdated", handler);
    window.addEventListener("storage", (e) => {
      if (e.key === "sweetshop_favs") load();
    });
    return () => {
      window.removeEventListener("favoritesUpdated", handler);
    };
  }, []);

  const remove = (id) => {
    try {
      const raw = localStorage.getItem("sweetshop_favs");
      const favs = raw ? JSON.parse(raw) : [];
      const next = favs.filter((x) => x !== id);
      localStorage.setItem("sweetshop_favs", JSON.stringify(next));
      window.dispatchEvent(new Event("favoritesUpdated"));
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      // ignore
    }
  };

  if (loading)
    return (
      <main style={{ padding: "1rem" }}>
        <h2>Favorites</h2>
        <p>Loading…</p>
      </main>
    );

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Favorites</h2>
      {items.length === 0 ? (
        <p>
          Your favorite sweets will appear here.{" "}
          <Link to="/sweets">Browse sweets</Link>
        </p>
      ) : (
        <div className="favorites-grid">
          {items.map((s) => (
            <div key={s._id} className="fav-card">
              <div className="fav-thumb">
                <img
                  src={
                    s.image
                      ? `http://localhost:5000${s.image}`
                      : s.imageUrl || "https://via.placeholder.com/320x200"
                  }
                  alt={s.name}
                />
              </div>
              <div className="fav-body">
                <h4 className="fav-title">{s.name}</h4>
                <div className="fav-price">₹{s.price}</div>
                <div className="fav-actions">
                  <Link to={`/sweets/${s._id}`} className="fav-view">
                    View
                  </Link>
                  <button onClick={() => remove(s._id)} className="fav-remove">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
