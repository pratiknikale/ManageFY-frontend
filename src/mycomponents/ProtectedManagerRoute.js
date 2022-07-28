import React from "react";
import {Outlet} from "react-router";
// import Auth from './Auth';
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect} from "react";

function ProtectedManagerRoute(props) {
  const role = useSelector((state) => state.user.role);

  return role === "manager" ? <Outlet /> : <Navigate to="/mytasks" />;
}

export default ProtectedManagerRoute;
