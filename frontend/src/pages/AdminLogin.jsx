import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isNotAdmin, setIsNotAdmin] = useState(false); // State to track admin authorization
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error messages
        setIsNotAdmin(false); // Reset admin check

        try {
            const response = await axios.post('http://localhost:4000/api/user/login', userData);

            const userInfo = response.data.name;
            const token = response.data.token;

            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('token', token);

            if (response.data.isAdmin) {
                navigate('/admindashboard');
            } else {
                setIsNotAdmin(true); // Set state if the user is not an admin
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
       
        <Container className="login-container">
        <h3 className="text-center mb-4 login-heading">Admin Login</h3>
        <Form onSubmit={handleSubmit} className="login-form">
          {error && <p className="text-danger text-center error-message">{error}</p>}
          {isNotAdmin && (
            <p className="text-danger text-center error-message">
              You are not an authorized admin.
            </p>
          )}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
  
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
  
          <Button variant="primary" type="submit" className="w-100 login-button">
            Login
          </Button>
        </Form>
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register" className="text-link">
            Registration
          </Link>
        </p>
        <p className="text-center mt-3">
          If you are a user, click here to{" "}
          <Link to="/" className="text-link">
            Login
          </Link>
        </p>
      </Container>
    );
};

export default Login;
