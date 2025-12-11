import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "./AdminNavBar";
import "./styles/adminpanel.css";

const AdminPanel = ({ adminToken }) => {
  const [userRole, setUserRole] = useState("");
  const [sweets, setSweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    role: "",
  });
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

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/auth/users", {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    if (adminToken) fetchUsers();
  }, [adminToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddSweet = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!form.name || !form.price || !form.quantity || !form.category) {
      setError("All fields are required");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", parseFloat(form.price));
      data.append("quantity", parseInt(form.quantity));
      data.append("category", form.category);
      data.append("description", form.description);
      if (form.image) {
        data.append("image", form.image);
      }

      const response = await axios.post("/api/sweets", data, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      console.log("Sweet added successfully:", response.data);

      // Clear form
      setForm({
        name: "",
        price: "",
        quantity: "",
        category: "",
        description: "",
        image: null,
      });

      // Reset file input
      const fileInput = document.getElementById("sweet-image-upload");
      if (fileInput) fileInput.value = "";

      // Refresh sweets list
      const res = await axios.get("/api/sweets");
      setSweets(res.data);
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to add sweet";
      setError(errorMsg);
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

  // User Management Functions
  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditUserForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (id) => {
    setUserError("");
    try {
      await axios.put(`/api/auth/users/${id}`, editUserForm, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setEditingUserId(null);
      const res = await axios.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      setUserError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setUserError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (userRole !== "admin") return null;
  return (
    <>
      <AdminNavBar
        onLogout={() => {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }}
      />
      <div className="adminPanelContainer" id="products">
        <div className="adminPanelTitle">Product Management</div>
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
            <textarea
              className="adminFormInput"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              style={{
                gridColumn: "1 / -1",
                minHeight: "80px",
                resize: "vertical",
              }}
            />
            <div className="adminFormFile">
              <input
                type="file"
                name="image"
                onChange={handleChange}
                id="sweet-image-upload"
                accept="image/*"
                className="adminFormFileInput"
              />
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

      {/* User Management Section */}
      <div
        className="adminPanelContainer"
        id="users"
        style={{ marginTop: "2rem" }}
      >
        <div className="adminPanelTitle">User Management</div>
        {userError && (
          <p style={{ color: "red", marginBottom: 12 }}>{userError}</p>
        )}
        <div className="sweetsListSection">
          <table className="sweetsTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingUserId === user._id ? (
                    // Edit mode
                    <>
                      <td>
                        <input
                          className="adminFormInput"
                          name="username"
                          value={editUserForm.username}
                          onChange={handleEditUserChange}
                          placeholder="Username"
                          required
                        />
                      </td>
                      <td>
                        <input
                          className="adminFormInput"
                          name="email"
                          value={editUserForm.email}
                          onChange={handleEditUserChange}
                          placeholder="Email"
                          type="email"
                          required
                        />
                      </td>
                      <td>
                        <select
                          className="adminFormInput"
                          name="role"
                          value={editUserForm.role}
                          onChange={handleEditUserChange}
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="actionBtn"
                          title="Update"
                          onClick={() => handleUpdateUser(user._id)}
                        >
                          <span role="img" aria-label="update">
                            ✅
                          </span>
                        </button>
                        <button
                          className="actionBtn"
                          title="Cancel"
                          onClick={() => setEditingUserId(null)}
                        >
                          <span role="img" aria-label="cancel">
                            ❌
                          </span>
                        </button>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          style={{
                            background:
                              user.role === "admin" ? "#e74c3c" : "#3498db",
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="actionBtn"
                          title="Edit"
                          onClick={() => startEditUser(user)}
                        >
                          <span role="img" aria-label="edit">
                            ✏️
                          </span>
                        </button>
                        <button
                          className="actionBtn"
                          title="Delete"
                          onClick={() => handleDeleteUser(user._id)}
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
    </>
  );
};

export default AdminPanel;
