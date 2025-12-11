import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import Profile from "./Profile.jsx";
import Footer from "./Footer.jsx";

function Layout({ children, adminToken }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <NavBar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout adminToken={adminToken}>
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
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin-login"
                element={<AdminLogin setAdminToken={setAdminToken} />}
              />
              <Route
                path="/admin"
                element={<AdminPanel adminToken={adminToken} />}
              />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
