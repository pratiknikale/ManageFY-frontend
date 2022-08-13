import React, {useState, useEffect, useRef} from "react";
import {Container, Button, Form, Row, Col, Accordion, Card} from "react-bootstrap";
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

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const Auth = () => {
  const AnimatedImage = useRef(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const [isSignup, setIsSignup] = useState(false);
  const [FormData, setFormFields] = useState(defaultFormFields);
  const [isSinginSignupLoading, setIsSinginSignupLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFieldChange = (e) => {
    setFormFields({...FormData, [e.target.name]: e.target.value});
  };

  useEffect(() => {
    lottie.loadAnimation({
      container: AnimatedImage.current,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSinginSignupLoading(true);
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
      <Container className="authContainer" fluid>
        <div className="HomeLandingPageSection">
          <Row>
            <Col sm={6} style={{paddingTop: "12%"}}>
              <h2 className="GradientText" style={{color: "white"}}>
                Manage, organize, and collaborate on work from virtually anywhere
              </h2>
              <br></br>
              <p style={{color: "#c5c5c5", fontSize: "18px"}}>
                Task management is the link between planning to do something and getting it done. ManageFY provides an
                overview of work in progress that enables tracking from conception to completion. Enter ManageFY: join
                teams everywhere and gain a clear overview of task progress. Let's get organized together!
              </p>
            </Col>
            <Col sm={6}>
              <div className="AnimatedImage" ref={AnimatedImage}></div>
            </Col>
          </Row>
        </div>
        <div className="HomeLandingSignInSection">
          <h2 className="GradientText" style={{marginTop: "6px", textAlign: "center", color: "white"}}>
            {isSignup ? "Employee Sign Up" : "Sign In"}
          </h2>

          <Form className="signinupForm" style={{marginTop: "35px"}} onSubmit={(e) => handleSubmit(e)}>
            <>
              {isSignup && (
                <>
                  <Form.Group controlId="formBasicFirstName">
                    <Form.Control
                      className="formControl"
                      onChange={(e) => onFieldChange(e)}
                      name="FirstName"
                      type="text"
                      defaultValue=""
                      placeholder="First Name"
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicLastName">
                    <Form.Control
                      className="formControl"
                      onChange={(e) => onFieldChange(e)}
                      name="LastName"
                      type="text"
                      defaultValue=""
                      placeholder="Last Name"
                      required
                    />
                  </Form.Group>
                </>
              )}
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  className="formControl"
                  onChange={(e) => onFieldChange(e)}
                  name="Email"
                  type="email"
                  defaultValue=""
                  placeholder="Email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Control
                  className="formControl"
                  onChange={(e) => onFieldChange(e)}
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  defaultValue=""
                  placeholder="Password"
                  required
                />
                {showPassword ? (
                  <i className="fa-solid fa-eye passEyeIcon" onClick={() => setShowPassword(!showPassword)}></i>
                ) : (
                  <i className="fa-solid fa-eye-slash passEyeIcon" onClick={() => setShowPassword(!showPassword)}></i>
                )}
              </Form.Group>
            </>
            <hr className="authDivider" />
            <Button
              style={{borderRadius: "20px"}}
              className="authFormBtns1"
              onClick={() => {
                setIsSignup((prevIsSignup) => !prevIsSignup);
              }}
              variant="dark"
            >
              {isSignup ? "Already have an employee account Click here" : "Don't have an account Click Here "}
            </Button>
            <Button
              className="authFormBtns3 ButtonGradientBackground"
              style={{borderRadius: "20px"}}
              variant="primary"
              type="submit"
              disabled={isSinginSignupLoading}
            >
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

          {!isSignup && (
            <Accordion style={{marginTop: "10px"}}>
              <Card style={{backgroundColor: "black", borderRadius: "20px"}}>
                <Card.Header style={{display: "flex", justifyContent: "center"}}>
                  <Accordion.Toggle
                    as={Button}
                    variant="dark"
                    eventKey="1"
                    style={{border: "hidden", width: "100%", color: "grey", borderRadius: "20px"}}
                  >
                    Demo Credentials
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body style={{padding: "0px 20px 0px 20px", color: "grey", fontSize: "15px"}}>
                    <span>
                      <b>Manager : </b>
                    </span>
                    <br></br>
                    <span style={{marginLeft: "8px"}}>Email : manager@demo.com</span>
                    <br></br>
                    <span style={{marginLeft: "8px"}}>Pass : 123456789</span>
                    <br></br>
                    <span>
                      <b>Jr. Employee : </b>
                    </span>
                    <br></br>
                    <span style={{marginLeft: "8px"}}>Email : john@demo.com</span>
                    <br></br>
                    <span style={{marginLeft: "8px"}}>Pass : 123456789</span>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          )}
        </div>
      </Container>
    </>
  );
};

export default Auth;
