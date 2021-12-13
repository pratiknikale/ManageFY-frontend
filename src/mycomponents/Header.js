import React, { useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import decode from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import {AppContext} from '../App';




const userNameHead = {
    color: "white",
    marginTop: 0,
    marginBottom: 0,
    marginRight: "20px",
    
  };


const Header = () => {

    const {isUser} = useContext(AppContext);
    const {setUser} = useContext(AppContext);
    const {userName} = useContext(AppContext);
    const {setUserName} = useContext(AppContext);


    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('profile'));
        if(token){
            const decodedtoken = decode(token.token);
            if(decodedtoken.exp * 1000 < new Date().getTime()) logout();

            
            const FName = token.result.firstName;
            const LName = token.result.lastName;
            const newFName = FName.charAt(0).toUpperCase() + FName.slice(1);
            const newLName = LName.charAt(0).toUpperCase() + LName.slice(1);
                
            setUser(token);
                
            setUserName(newFName + ' ' + newLName);
            // console.log(userName);

            
        };
        
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

    const logout = () => {
        localStorage.clear('profile');
        setUser('');
        setUserName('');
        navigate('/');
    }
    return (
        <>

        
        
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to={"/list"}>TODO</Navbar.Brand>
        {isUser && (
            <>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto my-2 my-lg-0" navbarScroll>
                    <Nav.Link as={Link} to={"/home"}>Home</Nav.Link>
                    {/* <Nav.Link as={Link} to={"/createTask"}>Create Task</Nav.Link> */}
                </Nav>
            <p style={userNameHead}><b style={{display: "flex", alignItems: "center"}}><i className="fas fa-user-circle mr-2 fa-2x"></i>{userName}</b></p>
            <br/>
            <Button variant="danger" onClick={logout}><i className="fas fa-sign-out-alt mr-2"></i>Logout</Button>
                
            </Navbar.Collapse>
            </>
        )}
        
        </Navbar>



            
        </>
    )
}

export default Header;