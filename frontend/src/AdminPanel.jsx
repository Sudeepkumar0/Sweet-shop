// ...existing code...
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2>Admin Panel</h2>
      <form
        onSubmit={handleAddSweet}
        style={{ marginBottom: 24, display: "flex", gap: 8 }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Add Sweet
        </button>
      </form>
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sweets.map((sweet) => (
            <tr key={sweet._id}>
              {editingId === sweet._id ? (
                <>
                  <td>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      style={{
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      name="price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      style={{
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      name="quantity"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      style={{
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={{
                        padding: 4,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  </td>
                  <td>
                    {sweet.image && (
                      <img
                        src={`http://localhost:5000${sweet.image}`}
                        alt={sweet.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        margin: "0 2px",
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleUpdateSweet(sweet._id)}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        background: "#6c757d",
                        color: "#fff",
                        margin: "0 2px",
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{sweet.name}</td>
                  <td>{sweet.price}</td>
                  <td>{sweet.quantity}</td>
                  <td>{sweet.category}</td>
                  <td>
                    {sweet.image && (
                      <img
                        src={`http://localhost:5000${sweet.image}`}
                        alt={sweet.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      style={{
                        background: "#ffc107",
                        color: "#333",
                        margin: "0 2px",
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => startEdit(sweet)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        margin: "0 2px",
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleDelete(sweet._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
