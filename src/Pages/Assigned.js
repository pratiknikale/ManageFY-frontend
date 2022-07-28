import {useState, useEffect} from "react";
import {Button, Container, Form, Table, FormControl} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {getEmployeeList, getEditUser, EditUser, DeleteUser} from "../services/api";
import {css} from "@emotion/react";
import UserEdit from "../mycomponents/UserEdit";

const Assigned = () => {
  useEffect(() => {
    // getAllEmployeeList().then(() => {
    //   setIsNewEmployeeLoadingList(false);
    // });

    window.scrollTo({top: 0, left: 0});
  }, []);

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Assigned Tasks</h4>

      {/* <hr
  style={{
    backgroundColor: "white",
    marginBottom: "40px",
    width: "70%",
    border: "0",
    height: "1px",
    backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
  }}
/> */}
      <Container style={{marginBottom: "170px", flex: "1 0 auto"}}></Container>
    </>
  );
};

export default Assigned;
