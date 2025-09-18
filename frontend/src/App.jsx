import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import SweetsList from "./SweetsList.jsx";
import AdminPanel from "./AdminPanel.jsx";
import AdminLogin from "./AdminLogin.jsx";

function App() {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || ""
  );
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sweets" element={<SweetsList />} />
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
    </AuthProvider>
  );
}

export default App;
