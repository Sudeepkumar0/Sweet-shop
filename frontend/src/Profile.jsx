import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

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
  const { token, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    const p = decodeJwt(token);
    setSession(p);
    axios
      .get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (newPassword !== confirm) return setErr("Passwords do not match");
    try {
      const res = await axios.post(
        "/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || "Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setErr(err.response?.data?.message || err.message);
    }
  };

  if (!token) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Profile</h2>
        <p>Please log in to view your profile.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2>Profile</h2>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{ background: "#fff9f8", padding: 16, borderRadius: 8 }}
            >
              <h3>Account</h3>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
              <button
                onClick={() => {
                  logout();
                }}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: "#ff6b95",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Logout
              </button>
            </div>

            <div
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    style={{ width: "100%", padding: 8 }}
                  />
                </div>
                {err && (
                  <div style={{ color: "#b00020", marginBottom: 8 }}>{err}</div>
                )}
                {msg && (
                  <div style={{ color: "#0b8b3a", marginBottom: 8 }}>{msg}</div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "8px 12px",
                    background: "#6b46ff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                  }}
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>

          <aside style={{ width: 300 }}>
            <div
              style={{ background: "#fff9f8", padding: 16, borderRadius: 8 }}
            >
              <h3>Session</h3>
              <p>
                <strong>Token ID:</strong> {session?.id || session?.sub || "-"}
              </p>
              <p>
                <strong>Issued:</strong>{" "}
                {session?.iat
                  ? new Date(session.iat * 1000).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Expires:</strong>{" "}
                {session?.exp
                  ? new Date(session.exp * 1000).toLocaleString()
                  : "-"}
              </p>
              <p style={{ wordBreak: "break-all", fontSize: 12 }}>
                <strong>Raw token:</strong> <br />
                {token}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
