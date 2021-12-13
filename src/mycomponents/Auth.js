import React, { useState } from 'react';
import { Container, Button, Form, } from 'react-bootstrap';
import { signup, signin } from '../services/api';
import {useNavigate} from 'react-router-dom';
import '../styles/auth.css';

const defaultFormFields = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
}

const Auth = () => {
    
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [FormData, setFormFields] = useState(defaultFormFields);
    

    const onFieldChange = (e) =>{
        setFormFields({ ...FormData, [e.target.name]: e.target.value });
        // console.log(signupFields);
    }

    

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup === true){
            signup(FormData, navigate);
            
            // console.log("signup")
            // console.log(FormData);
        }else{
            signin(FormData, navigate)
            // console.log("Signin")
            // console.log(FormData);
        }
    }
    
    
    
    return (
        <>
        <Container>
        <h2 style={{marginTop: "50px", textAlign: "center", color: "white"}}>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        
            <Form className="signinupForm" style={{marginTop: "50px"}} onSubmit={(e) => handleSubmit(e)}>
        {isSignup && (
            <>
                <Form.Group controlId="formBasicFirstName">
                    <Form.Label className="authFormLabels">First Name</Form.Label>
                    <Form.Control onChange={(e) => onFieldChange(e)} name="FirstName" type="text" defaultValue="" placeholder="Enter First Name" required />
                    
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                    <Form.Label className="authFormLabels">Last Name</Form.Label>
                    <Form.Control onChange={(e) => onFieldChange(e)} name="LastName" type="text" defaultValue="" placeholder="Enter Last Name" required/>
                    
                </Form.Group>
            </>
            )    
            }
                <Form.Group controlId="formBasicEmail">
                    <Form.Label className="authFormLabels">Email address</Form.Label>
                    <Form.Control onChange={(e) => onFieldChange(e)} name="Email" type="email" defaultValue="" placeholder="Enter email" required/>
                    {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>
        
                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="authFormLabels">Password</Form.Label>
                    <Form.Control onChange={(e) => onFieldChange(e)} name="Password" type="password" defaultValue="" placeholder="Password" required/>
                </Form.Group>
                <hr className="authDivider"/>
            <Button className="authFormBtns1" onClick={() => {setIsSignup((prevIsSignup) => !prevIsSignup)}} variant="dark">
                {isSignup ? 'Already have an account Click here' : 'Don\'t have an account Click Here '}
            </Button>
            <Button className="authFormBtns2" variant="primary" type="submit">
                {isSignup ? 'Submit' : 'Sign In'}
            </Button>
            </Form>
                
                
        
        </Container>
        

            
        </>
    )
}

export default Auth;