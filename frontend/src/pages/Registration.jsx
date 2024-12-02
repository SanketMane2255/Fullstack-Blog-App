import axios from 'axios'
import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const Registration = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
      setUserData({...userData, [e.target.name]:e.target.value})
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:4000/api/user/register',userData)
            navigate('/')

        } catch(error){
            setError(error.response?.data?.message || "Registration Failed")
        }

    };

    return (

        <Container className="login-container">
        <h3 className="text-center mb-4 login-heading">Registration</h3>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
  
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
            Register
          </Button>
        </Form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-link">
            Login
          </Link>
        </p>
      </Container>
    )
}

export default Registration