import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    //console.log(loggedInUser)
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('user'))
        //console.log(setLoggedInUser)
    }, [])
    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('logedInUser');
        setTimeout(() => {
            navigate('/')
        }, 1000)
    }
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                {/* <Navbar.Brand href="/">MyApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav"> */}
                <Nav className="ms-auto w-100 justify-content-evenly">
                    <LinkContainer to="/">
                        <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/createblog">
                        <Nav.Link>Create Blog</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/blogs">
                        <Nav.Link>Blogs</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/profile">
                        <Nav.Link>Profile</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/logout">
                        <Nav.Link><button onClick={handleLogout} className="btn btn-primary ">
                            Logout
                        </button></Nav.Link>
                    </LinkContainer>
                </Nav>
                {/* </Navbar.Collapse> */}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
