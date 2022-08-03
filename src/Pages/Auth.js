import React, {useState, useEffect, useRef} from "react";
import {Container, Button, Form, Row, Col} from "react-bootstrap";
import {signup, signin} from "../services/api";
import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {css} from "@emotion/react";
import "../styles/auth.css";
import {useSelector} from "react-redux/es/exports";
import lottie from "lottie-web";

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
  const cont = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const [isSignup, setIsSignup] = useState(false);
  const [FormData, setFormFields] = useState(defaultFormFields);
  // const [ManagerFormData, setManagerFormData] = useState(defaultManagerFormFields);
  // const [isManager, setIsManager] = useState(false);
  const [isSinginSignupLoading, setIsSinginSignupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // <i class="fa-solid fa-eye"></i>
  // <i class="fa-solid fa-eye-slash"></i>

  const onFieldChange = (e) => {
    setFormFields({...FormData, [e.target.name]: e.target.value});
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: cont.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../config/lottieOffice2.json"),
    });
  }, []);

  useEffect(() => {
    if (user.token) {
      navigate("/mytasks");
    }
  }, [user]);

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
      <Container fluid style={{height: "100%", display: "flex", flexDirection: "row", overflow: "hidden"}}>
        <div style={{width: "74%", overflowX: "auto", padding: "30px", paddingTop: "80px"}}>
          <Row>
            <Col sm={6} style={{paddingTop: "12%"}}>
              <h2 style={{color: "white"}}>Manage, organize, and collaborate on work from virtually anywhere</h2>
              <br></br>
              <p style={{color: "white", fontSize: "18px"}}>
                Task management is the link between planning to do something and getting it done. Your task management
                software should provide an overview of work in progress that enables tracking from conception to
                completion. Enter ManageFY: join teams everywhere and gain a clear overview of task progress. Let's get
                organized together!
              </p>
            </Col>
            <Col sm={6}>
              <div style={{width: "100%", height: "100%", marginTop: "-6%"}} className="cont" ref={cont}></div>
            </Col>
          </Row>
        </div>
        <div style={{width: "26%", padding: "30px", backgroundColor: "#1d2124"}}>
          <h2 style={{marginTop: "35px", textAlign: "center", color: "white"}}>
            {
              // isManager ? "Manager Signin" :
              isSignup ? "Employee Sign Up" : "Sign In"
            }
          </h2>

          <Form className="signinupForm" style={{marginTop: "35px"}} onSubmit={(e) => handleSubmit(e)}>
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
                  type={showPassword ? "text" : "password"}
                  defaultValue=""
                  placeholder="Password"
                  style={{position: "relative", display: "inline"}}
                  required
                />
                {showPassword ? (
                  <i className="fa-solid fa-eye passEyeIcon" onClick={() => setShowPassword(!showPassword)}></i>
                ) : (
                  <i className="fa-solid fa-eye-slash passEyeIcon" onClick={() => setShowPassword(!showPassword)}></i>
                )}
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
              {isSignup ? "Already have an employee account Click here" : "Don't have an account Click Here "}
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
              {isSinginSignupLoading
                ? isSignup
                  ? "Signing up..."
                  : "Signing in..."
                : isSignup
                ? "Sign Up"
                : "Sign In"}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default Auth;
