
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const Profile = () => {
    const [user, setUser] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [blogCount, setBlogCount] = useState(0);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get('http://localhost:4000/api/user/profile', config);

                setUser(response.data.user);
                setBlogs(response.data.blogs);
                setBlogCount(response.data.blogCount);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.response?.data?.message || 'Failed to load profile');
                setIsAuthenticated(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = (blogId) => {
        navigate(`/edit-blog/${blogId}`);
    };

    const handleDelete = async (blogId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.delete(`http://localhost:4000/api/blog/${blogId}/delete`, config);
            setBlogs(blogs.filter((blog) => blog._id !== blogId));
        } catch (error) {
            console.error('Error deleting blog', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">
                    <h4>Please login to view the profile</h4>
                </Alert>
                <Button variant="secondary" onClick={() => navigate('/')}>
                    Login
                </Button>
            </Container>
        );
    }

    return (
        <Container className="profile-container mt-5">
            <h1 className="text-center mb-4 profile-heading">{user.name}'s Profile</h1>
            <p className="text-center profile-email">Email: {user.email}</p>
            <p className="text-center profile-blog-count">Total Blogs: {blogCount}</p>

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            <Row>
                {blogs.length === 0 ? (
                    <p className="text-center">No blogs available</p>
                ) : (
                    blogs.map((blog) => (
                        <Col md={4} className="mb-4" key={blog._id}>
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <Card.Title>{blog.title}</Card.Title>
                                    <Card.Text className="blog-content">
                                        {blog.content}
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">
                                            Likes: {blog.likes.length}, Comments: {blog.comments.length}
                                        </small>
                                    </Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(blog._id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default Profile;



