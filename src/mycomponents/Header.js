import React, {useEffect, useContext} from "react";
import {Link, useLocation} from "react-router-dom";
import decode from "jwt-decode";
import {useNavigate} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import {AppContext} from "../App";
import "../styles/Sidebar.css";
import "../styles/header.css";
import {Dropdown, Image} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {setLoggedUser, setLoggedUserRole} from "../features/user/userSlice";
import logo from "../images/ManageFY_logo.jpg";

const userNameHead = {
  color: "white",
  marginTop: 0,
  marginBottom: 0,
  marginRight: "20px",
};

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const {userName, setUserName} = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("profile"));
    if (token) {
      const decodedtoken = decode(token.token);
      if (decodedtoken.exp * 1000 < new Date().getTime()) logout();

      const FName = token.result.firstName;
      const LName = token.result.lastName;
      const Role = token.result.role;
      const newFName = FName.charAt(0).toUpperCase() + FName.slice(1);
      const newLName = LName.charAt(0).toUpperCase() + LName.slice(1);

      dispatch(setLoggedUser(token));
      dispatch(setLoggedUserRole(Role));
      setUserName(newFName + " " + newLName);
      // console.log(window.location.pathname);
    }
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = () => {
    localStorage.clear("profile");
    dispatch(setLoggedUser(""));
    // dispatch(setLoggedUserRole(""));
    setUserName("");
    navigate("/");
    window.location.reload();
    // alert("You are loggedout")
  };
  return (
    <>
      <Navbar sticky="top" bg="dark" variant="dark" expand="lg" style={{position: "fixed", width: "100%"}}>
        <Navbar.Brand as={Link} to={"/mytasks"}>
          {/* ManageFY */}
          <Image src={logo} style={{width: "130px", borderRadius: "100px"}} fluid />
        </Navbar.Brand>
        {user.result && (
          <>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="mr-auto my-2 my-lg-0" navbarScroll></Nav>
              <p style={userNameHead}>
                <b style={{display: "flex", alignItems: "center"}}>
                  <i className="fas fa-user-circle mr-2 fa-2x"></i>
                  {userName}
                </b>
              </p>
              <br />

              {/* <Dropdown className="mx-3">
                <Dropdown.Toggle className="dropdownTG" variant="light">
                  <i className="far fa-bell"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu style={{right: "0", left: "auto", minWidth: "240px"}}>
                  {notification && <p>hsdhfsfdg</p>}
                  {notification &&
                    notification.map((notification) => (
                      <Dropdown.Item href="#/action-1">
                        New message from: <b>{notification.sender.firstName}</b>
                        <br />
                        <p>
                          msg: <b>{notification.content}</b>
                        </p>
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown> */}
              <Nav className="justify-content-end">
                <Nav.Link onClick={logout}>
                  <i className="fas fa-sign-out-alt mr-2 mt-1" style={{fontSize: "22px"}}></i>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Navbar>
    </>
  );
};

export default Header;
