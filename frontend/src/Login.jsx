// ...existing code...
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import "./styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const { hydrate } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;
      login(token);
      localStorage.setItem("jwt", token);
      // Sync local cart with server cart
      try {
        const raw = localStorage.getItem("sweetshop_cart");
        const localCart = raw ? JSON.parse(raw) : [];
        // If there are local items, merge them server-side
        if (localCart && localCart.length > 0) {
          const merged = await axios.post(
            "/api/cart/merge",
            { items: localCart },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // hydrate cart context with merged cart
          hydrate(merged.data);
          localStorage.setItem("sweetshop_cart", JSON.stringify(merged.data));
        } else {
          // otherwise fetch server cart
          const serverCart = await axios.get("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          hydrate(serverCart.data || []);
          localStorage.setItem(
            "sweetshop_cart",
            JSON.stringify(serverCart.data || [])
          );
        }
      } catch (syncErr) {
        // ignore sync errors but continue
        console.warn(
          "Cart sync failed:",
          syncErr?.response?.data || syncErr.message || syncErr
        );
      }

      navigate("/sweets");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="loginMain">
      <div className="logincard">
        <h2 className="loginCardHeading">Sweet Shop</h2>
        <form className="loginForm" onSubmit={handleSubmit}>
          <input
            className="formInput"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="formInput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="loginButton">
            Login
          </button>
        </form>
        {error && (
          <p style={{ color: "#ef4444", marginTop: 8, fontWeight: 500 }}>
            {error}
          </p>
        )}
        <div className="LoginRegisterDiv">
          <span className="loginSpan">If you are a new user? </span>
          <a
            className="LoginRegisterLink"
            href="/register"
            onMouseOver={(e) => (e.target.style.color = "#eb2528ff")}
            onMouseOut={(e) => (e.target.style.color = "#ff4f9d")}
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
