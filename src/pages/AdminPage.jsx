import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";

const AdminPage = () => {
  return (
    <Routes>
      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* All admin routes */}
      <Route path="/*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminPage;
