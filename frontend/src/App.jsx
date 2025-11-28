import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import SweetsList from "./SweetsList.jsx";
import AdminPanel from "./AdminPanel.jsx";
import AdminLogin from "./AdminLogin.jsx";
import NavBar from "./NavBar.jsx";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import Favorites from "./Favorites.jsx";
import About from "./About.jsx";
import Search from "./Search.jsx";

function App() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/sweets" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sweets" element={<SweetsList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/admin-login"
              element={<AdminLogin setAdminToken={setAdminToken} />}
            />
            <Route
              path="/admin"
              element={<AdminPanel adminToken={adminToken} />}
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
