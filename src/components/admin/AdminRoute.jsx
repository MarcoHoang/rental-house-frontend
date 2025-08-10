import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../../utils/localStorage";

const AdminRoute = ({ children }) => {
  return isAdminAuthenticated() ? (
    children
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminRoute;
