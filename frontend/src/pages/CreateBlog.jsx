
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    images: []
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append('title', blog.title);
    formData.append('content', blog.content);

    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:4000/api/blog/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setError(response.data.message)
      setLoading(false);
      
      setTimeout(()=>{
          navigate(`/blogs`);
      },2000)
    } catch (err) {
      setLoading(false);
      setError('Error creating blog');
    }
  };

  return (
    <Container className="login-container mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4 login-heading">Create a New Blog</h2>
          {error && (
            <div className="alert alert-success error-message" role="alert">
              {error}
            </div>
          )}
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter blog title"
                value={blog.title}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                placeholder="Enter blog content"
                value={blog.content}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="images" className="mt-3">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                className="form-control"
              />
            </Form.Group>
            <br/>

            <Button variant="primary" type="submit" className="w-100 login-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateBlog;

























