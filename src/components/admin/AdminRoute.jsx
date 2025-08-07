import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAdminAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    const adminUser = localStorage.getItem("adminUser");
    return token && adminUser;
  };

  return isAdminAuthenticated() ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;
