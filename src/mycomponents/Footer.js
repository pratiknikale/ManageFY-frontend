import React from "react";

const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#343a40",
        textAlign: "center",
        padding: "10px",
        bottom: "0px",
        flexShrink: "0",
        // position: "fixed",
        // width: "82%",
      }}
    >
      <span style={{color: "white", justifyContent: "center"}}>Copyright © 2022 ManageFY</span>
    </div>
  );
};

export default Footer;
