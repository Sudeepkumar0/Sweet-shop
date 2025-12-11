import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaKey,
  FaClock,
  FaSignOutAlt,
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import "./styles/profile.css";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return json;
  } catch (e) {
    return null;
  }
}

export default function Profile() {
  const { token, logout, user } = useContext(AuthContext);
  const { items: cartItems } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [favorites, setFavorites] = useState(0);

  useEffect(() => {
    if (!token) return;
    const p = decodeJwt(token);
    setSession(p);
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch(() => setUserData(null));

    // Load favorites count
    const favs = JSON.parse(localStorage.getItem("sweetshop_favs") || "[]");
    setFavorites(favs.length);
  }, [token]);

  // Update favorites count when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const favs = JSON.parse(localStorage.getItem("sweetshop_favs") || "[]");
      setFavorites(favs.length);
    };
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically in case localStorage changes in same tab
    const interval = setInterval(() => {
      const favs = JSON.parse(localStorage.getItem("sweetshop_favs") || "[]");
      setFavorites(favs.length);
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (newPassword !== confirm) return setErr("Passwords do not match");
    if (newPassword.length < 6)
      return setErr("Password must be at least 6 characters");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setErr(err.response?.data?.message || err.message);
    }
  };

  if (!token) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="profile-subtitle">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const userInitial = (
    userData?.name ||
    userData?.username ||
    user?.name ||
    "U"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p className="profile-subtitle">
          Manage your account settings and view your activity
        </p>
      </div>

      <div className="profile-grid">
        {/* Account Information Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">{userInitial}</div>
            <div style={{ textAlign: "center" }}>
              <h2 className="profile-name">
                {userData?.name || userData?.username || "User"}
              </h2>
              <p className="profile-email">
                {userData?.email || "user@example.com"}
              </p>
              <span
                className={`profile-badge ${
                  userData?.role === "admin"
                    ? "profile-badge-admin"
                    : "profile-badge-user"
                }`}
              >
                <FaShieldAlt /> {userData?.role || "user"}
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat-box">
              <p className="profile-stat-value">0</p>
              <p className="profile-stat-label">
                <FaShoppingCart /> Orders
              </p>
            </div>
            <div className="profile-stat-box">
              <p className="profile-stat-value">{favorites}</p>
              <p className="profile-stat-label">
                <FaHeart /> Favorites
              </p>
            </div>
            <div className="profile-stat-box">
              <p className="profile-stat-value">{cartItems?.length || 0}</p>
              <p className="profile-stat-label">
                <FaBoxOpen /> In Cart
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="profile-button profile-button-danger"
            style={{ width: "100%", marginTop: "1.5rem" }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <h3>
            <span className="profile-card-icon">
              <FaKey />
            </span>
            Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="profile-form-group">
              <label className="profile-form-label">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="profile-form-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">New Password</label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="profile-form-input"
              />
            </div>
            <div className="profile-form-group">
              <label className="profile-form-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="profile-form-input"
              />
            </div>
            {err && (
              <div className="profile-alert profile-alert-error">{err}</div>
            )}
            {msg && (
              <div className="profile-alert profile-alert-success">{msg}</div>
            )}
            <button
              type="submit"
              className="profile-button profile-button-primary"
            >
              <FaKey /> Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Session Information Card */}
      <div className="profile-card profile-session-card">
        <h3>
          <span className="profile-card-icon">
            <FaClock />
          </span>
          Session Information
        </h3>
        <div className="profile-info-row">
          <span className="profile-info-label">User ID:</span>
          <span className="profile-info-value">
            {session?.id || session?.sub || userData?._id || "-"}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Session Issued:</span>
          <span className="profile-info-value">
            {session?.iat ? new Date(session.iat * 1000).toLocaleString() : "-"}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Session Expires:</span>
          <span className="profile-info-value">
            {session?.exp ? new Date(session.exp * 1000).toLocaleString() : "-"}
          </span>
        </div>
        <div
          className="profile-info-row"
          style={{ flexDirection: "column", alignItems: "flex-start" }}
        >
          <span className="profile-info-label">JWT Token:</span>
          <div className="profile-token">{token}</div>
        </div>
      </div>
    </div>
  );
}
