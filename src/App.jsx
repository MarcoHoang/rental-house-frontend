// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Register from "./components/login-register/Register";
import Login from "./components/login-register/Login";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRoute from "./components/admin/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Future Routes - uncomment when ready */}
        {/* <Route path="/houses/:id" element={<HouseDetailPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
