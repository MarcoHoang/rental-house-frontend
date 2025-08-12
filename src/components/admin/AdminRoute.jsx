import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../../utils/localStorage";

const AdminRoute = ({ children }) => {
  const isAuthenticated = isAdminAuthenticated();
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    console.log('AdminRoute - Rendering admin content');
    return children;
  } else {
    console.log('AdminRoute - Redirecting to admin login');
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;
