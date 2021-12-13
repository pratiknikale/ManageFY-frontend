import React from "react";
import { Outlet } from "react-router";
// import Auth from './Auth';
import { Navigate } from 'react-router-dom';


function ProtectedRoute(props) {
  const isAuthenticated = localStorage.getItem("profile");

  return isAuthenticated ? <Outlet/> : <Navigate to="/"/>
}

export default ProtectedRoute;
