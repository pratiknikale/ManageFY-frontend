import React from "react";
import {Container} from "react-bootstrap";
import {useEffect} from "react";

const Settings = () => {
  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
  }, []);

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>Settings</h4>

      <Container style={{marginBottom: "170px", flex: "1 0 auto"}}></Container>
    </>
  );
};

export default Settings;
