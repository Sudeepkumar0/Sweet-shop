// ...existing code...
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/auth/register", { username, email, password });
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="registerMainDiv">
      <div className="registerCard">
        <div className="registerCardHeading">
          <h2>Sweet Shop</h2>
          <form onSubmit={handleSubmit} className="registerForm">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="formInput"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="formInput"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="formInput"
            />
            <button type="submit" className="registrationButton">
              Register
            </button>
          </form>
          {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: 8 }}>{success}</p>}
          <div className="RegisterLoginDiv">
            <span className="loginSpan">If you already have an account? </span>
            <a
              href="/login"
              className="RegisterLoginLink"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
