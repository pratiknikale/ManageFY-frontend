import React, {useState} from "react";
import {Container, Button, Form} from "react-bootstrap";
import {signup, signin} from "../services/api";
import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import "../styles/auth.css";

const defaultFormFields = {
  FirstName: "",
  LastName: "",
  Email: "",
  Password: "",
  Role: "employee",
};

const defaultManagerFormFields = {
  Email: "",
  Password: "",
  Role: "manager",
};

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const Auth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [FormData, setFormFields] = useState(defaultFormFields);
  // const [ManagerFormData, setManagerFormData] = useState(defaultManagerFormFields);
  // const [isManager, setIsManager] = useState(false);
  const [isSinginSignupLoading, setIsSinginSignupLoading] = useState(false);

  const onFieldChange = (e) => {
    setFormFields({...FormData, [e.target.name]: e.target.value});
  };

  // const onManagerFieldChange = (e) => {
  //   setManagerFormData({...ManagerFormData, [e.target.name]: e.target.value});
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSinginSignupLoading(true);
    // if (isManager === true) {
    //   signin(ManagerFormData, navigate).then(() => {
    //     setIsSinginSignupLoading(false);
    //     navigate("/mytasks");
    //   });
    // } else
    if (isSignup === true) {
      signup(FormData, navigate).then(() => {
        setIsSinginSignupLoading(false);
        navigate("/mytasks");
      });
    } else {
      signin(FormData, navigate).then(() => {
        setIsSinginSignupLoading(false);
        navigate("/mytasks");
      });
    }
  };

  return (
    <>
      <Container style={{height: "100%"}}>
        <h2 style={{marginTop: "50px", textAlign: "center", color: "white"}}>
          {
            // isManager ? "Manager Signin" :
            isSignup ? "Employee Sign Up" : "Sign In"
          }
        </h2>

        <Form className="signinupForm" style={{marginTop: "50px"}} onSubmit={(e) => handleSubmit(e)}>
          {/* {
          isManager ? (
            <>
              <Form.Group controlId="formBasicEmail">
                <Form.Label className="authFormLabels">Email address</Form.Label>
                <Form.Control
                  onChange={(e) => onManagerFieldChange(e)}
                  name="Email"
                  type="email"
                  defaultValue=""
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label className="authFormLabels">Password</Form.Label>
                <Form.Control
                  onChange={(e) => onManagerFieldChange(e)}
                  name="Password"
                  type="password"
                  defaultValue=""
                  placeholder="Password"
                  required
                />
              </Form.Group>
            </>
          ) : ( */}
          <>
            {isSignup && (
              <>
                <Form.Group controlId="formBasicFirstName">
                  <Form.Label className="authFormLabels">First Name</Form.Label>
                  <Form.Control
                    onChange={(e) => onFieldChange(e)}
                    name="FirstName"
                    type="text"
                    defaultValue=""
                    placeholder="Enter First Name"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                  <Form.Label className="authFormLabels">Last Name</Form.Label>
                  <Form.Control
                    onChange={(e) => onFieldChange(e)}
                    name="LastName"
                    type="text"
                    defaultValue=""
                    placeholder="Enter Last Name"
                    required
                  />
                </Form.Group>
              </>
            )}
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="authFormLabels">Email address</Form.Label>
              <Form.Control
                onChange={(e) => onFieldChange(e)}
                name="Email"
                type="email"
                defaultValue=""
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="authFormLabels">Password</Form.Label>
              <Form.Control
                onChange={(e) => onFieldChange(e)}
                name="Password"
                type="password"
                defaultValue=""
                placeholder="Password"
                required
              />
            </Form.Group>
          </>
          {/* )} */}
          <hr className="authDivider" />
          {/* {!isManager && ( */}
          <Button
            // disabled={isManager}
            className="authFormBtns1"
            onClick={() => {
              setIsSignup((prevIsSignup) => !prevIsSignup);
            }}
            variant="dark"
          >
            {isSignup ? "Already have employee an account Click here" : "Don't have an account Click Here "}
          </Button>
          {/* )} */}

          {/* <Button
            className="authFormBtns2"
            onClick={() => {
              setIsManager((prevIsSignup) => !prevIsSignup);
            }}
            variant="dark"
          >
            {isManager ? "Employee Signin" : "Manager Signin"}
          </Button> */}
          <Button className="authFormBtns3" variant="primary" type="submit" disabled={isSinginSignupLoading}>
            {isSinginSignupLoading && (
              <ClipLoader
                loading={isSinginSignupLoading}
                speedMultiplier={2}
                color={"white"}
                css={btnoverride}
                size={17}
              />
            )}
            {isSinginSignupLoading ? (isSignup ? "Signing up..." : "Signing in...") : isSignup ? "Sign Up" : "Sign In"}
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Auth;
