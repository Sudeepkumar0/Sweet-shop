// ...existing code...
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/adminpanel.css";

const AdminPanel = ({ adminToken }) => {
  const [userRole, setUserRole] = useState("");
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin role (assume backend has /api/auth/me endpoint)
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setUserRole(res.data.role);
        if (res.data.role !== "admin") navigate("/admin-login");
      } catch {
        navigate("/admin-login");
      }
    };
    fetchRole();
  }, [adminToken, navigate]);

  useEffect(() => {
    const fetchSweets = async () => {
      const res = await axios.get("/api/sweets");
      setSweets(res.data);
    };
    fetchSweets();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      await axios.post("/api/sweets", data, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setForm({ name: "", price: "", quantity: "", category: "", image: null });
      const res = await axios.get("/api/sweets");
      setSweets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add sweet");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSweets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Edit logic
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const startEdit = (sweet) => {
    setEditingId(sweet._id);
    setEditForm({
      name: sweet.name,
      price: sweet.price,
      quantity: sweet.quantity,
      category: sweet.category,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSweet = async (id) => {
    setError("");
    try {
      await axios.put(`/api/sweets/${id}`, editForm, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setEditingId(null);
      const res = await axios.get("/api/sweets");
      setSweets(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update sweet");
    }
  };

  if (userRole !== "admin") return null;
  return (
    <div className="adminPanelContainer">
      <div className="adminPanelTitle">Sweet Shop - Admin Panel</div>
      <form onSubmit={handleAddSweet}>
        <div className="adminFormGrid">
          <input
            className="adminFormInput"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Sweet Name (e.g., Chocolate Truffle)"
            required
          />
          <input
            className="adminFormInput"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (e.g., 2.50)"
            required
          />
          <input
            className="adminFormInput"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity (e.g., 100)"
            required
          />
          <input
            className="adminFormInput"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category (e.g., Candy, Chocolate)"
            required
          />
          <div className="adminFormFile">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              style={{ display: "none" }}
              id="sweet-image-upload"
            />
            <label htmlFor="sweet-image-upload" style={{ cursor: "pointer" }}>
              Click or drag an image here to upload
              <br />
              <span style={{ fontSize: "0.9rem", color: "#888" }}>
                PNG, JPG, GIF up to 10MB
              </span>
              <br />
              <span style={{ display: "inline-block", marginTop: 12 }}>
                <button
                  type="button"
                  className="adminFormButton"
                  style={{
                    background: "#fff0f6",
                    color: "#f582b2",
                    boxShadow: "none",
                    fontWeight: 600,
                  }}
                >
                  Browse Files
                </button>
              </span>
            </label>
          </div>
          <button type="submit" className="adminFormButton">
            Add Sweet
          </button>
        </div>
      </form>
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
      <div className="sweetsListSection">
        <div className="sweetsListTitle">Sweets List</div>
        <table className="sweetsTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet._id}>
                <td>
                  {sweet.image && (
                    <img
                      src={`http://localhost:5000${sweet.image}`}
                      alt={sweet.name}
                    />
                  )}
                </td>
                {editingId === sweet._id ? (
                  <>
                    <td>
                      <input
                        className="adminFormInput"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Sweet Name (e.g., Chocolate Truffle)"
                        required
                      />
                    </td>
                    <td>
                      <input
                        className="adminFormInput"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price (e.g., 2.50)"
                        required
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <input
                        className="adminFormInput"
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        placeholder="Quantity (e.g., 100)"
                        required
                        type="number"
                        min="0"
                        step="1"
                      />
                    </td>
                    <td>
                      <button
                        className="actionBtn"
                        title="Update"
                        onClick={() => handleUpdateSweet(sweet._id)}
                      >
                        <span role="img" aria-label="update">
                          ✅
                        </span>
                      </button>
                      <button
                        className="actionBtn"
                        title="Cancel"
                        onClick={() => setEditingId(null)}
                      >
                        <span role="img" aria-label="cancel">
                          ❌
                        </span>
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{sweet.name}</td>
                    <td>${parseFloat(sweet.price).toFixed(2)}</td>
                    <td>{sweet.quantity}</td>
                    <td>
                      <button
                        className="actionBtn"
                        title="Edit"
                        onClick={() => startEdit(sweet)}
                      >
                        <span role="img" aria-label="edit">
                          ✏️
                        </span>
                      </button>
                      <button
                        className="actionBtn"
                        title="Delete"
                        onClick={() => handleDelete(sweet._id)}
                      >
                        <span role="img" aria-label="delete">
                          🗑️
                        </span>
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
