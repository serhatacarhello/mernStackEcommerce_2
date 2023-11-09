import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { isAdmin, user } = props;
  const token = localStorage.getItem("token");

  if (isAdmin && user?.role === "admin") {
    return <Outlet />;
  }

  if (!isAdmin && token) {
    return <Outlet />;
  }

  return <Navigate to={"/"} />;
};

export default ProtectedRoute;
