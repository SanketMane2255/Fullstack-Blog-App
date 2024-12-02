import axios from 'axios'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react'

const CreateBlog = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("User is not authenticated.");
                return;
            }
    
            const response = await axios.post(
                "http://localhost:4000/api/blog/create",
                { title, content }, // Only send title and content
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token
                    },
                }
            );
    
            setMessage(response.data.message); // Backend should return a success message
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Error:", error);
            setMessage(error.response?.data?.message || "An error occurred");
        }
    };
    

  return (
    <Container className="mt-5">
    <Row className="justify-content-center">
      <Col md={8}>
        <h2 className="text-center mb-4">Create a New Blog</h2>
        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formContent" className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Create Blog
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
  )
}

export default CreateBlog