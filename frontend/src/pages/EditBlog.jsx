import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const EditBlog = () => {
    const { blogId } = useParams(); // Get the blog ID from the URL
    const navigate = useNavigate();
    const [blog, setBlog] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token'); // JWT from local storage
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get(`http://localhost:4000/api/blog/getSpecificBlog/${blogId}`, config);
                console.log(response)
                setBlog({ title: response.data.title, content: response.data.content });
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError(err.response?.data?.message || 'Failed to load blog details.');
            }
        };

        fetchBlog();
    }, [blogId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlog((prevBlog) => ({
            ...prevBlog,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.put(`http://localhost:4000/api/blog/${blogId}/update`, blog, config);
            setSuccess('Blog updated successfully!');
            setTimeout(() => navigate('/profile'), 2000); // Redirect back to profile after 2 seconds
        } catch (err) {
            console.error('Error updating blog:', err);
            setError(err.response?.data?.message || 'Failed to update blog.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Edit Blog</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            {success && <p className="text-success text-center">{success}</p>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Blog Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={blog.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContent">
                    <Form.Label>Blog Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="content"
                        value={blog.content}
                        onChange={handleChange}
                        placeholder="Enter blog content"
                        required
                    />
                </Form.Group>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                    <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => navigate('/profile')}
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default EditBlog;
