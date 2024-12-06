
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
//import './Blogs.css'; // Import custom CSS

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const [comments, setComments] = useState({});
    const [authError, setAuthError] = useState(""); // To handle unauthorized actions
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/blog/getALLBlogs");
                setBlogs(response.data.blog);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load blogs");
            }
        };

        fetchBlogs();
    }, [navigate]);

    const handleLike = async (blogId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setAuthError("Please login to like or comment on the blog");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:4000/api/blog/${blogId}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === blogId ? { ...blog, likes: response.data.blog.likes } : blog
                )
            );
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update likes");
        }
    };

    const handleAddComment = async (blogId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setAuthError("Please login to like or comment on the blog");
            return;
        }

        const currentComment = comments[blogId]?.trim();
        if (!currentComment) return;

        try {
            const response = await axios.post(
                `http://localhost:4000/api/blog/${blogId}/comment`,
                { comment: currentComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === blogId ? { ...blog, comments: response.data.blog.comments } : blog
                )
            );
            setComments((prev) => ({ ...prev, [blogId]: "" }));
        } catch (error) {
            setError(error.response?.data?.message || "Failed to add comment");
        }
    };

    const handleVisibility = (blog) => {
        navigate(`/blog/${blog._id}`);
    };

    return (
        <Container className="mt-5">
            {authError ? (
                <div className="text-center">
                    <Alert variant="danger">{authError}</Alert>
                    <Button variant="primary" onClick={() => navigate("/")}>
                        Back
                    </Button>
                </div>
            ) : (
                <>
                    <h2 className="text-center mb-4">Blogs</h2>
                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    <Row>
                        {blogs.length === 0 ? (
                            <p className="text-center">No blogs available</p>
                        ) : (
                            blogs.map((blog) => (
                                <Col key={blog._id} md={4} className="mb-4">
                                    <Card className="shadow-sm blog-card">
                                        <Card.Body>
                                            <Card.Title>{blog.title}</Card.Title>
                                            <Card.Text>{blog.content}</Card.Text>
                                            <Card.Text>
                                                <small className="text-muted">
                                                    Author: {blog.author?.name || "Unknown"}
                                                </small>
                                            </Card.Text>
                                            <Card.Text>
                                                <small className="text-muted">
                                                    Likes: {blog.likes.length}, Comments: {blog.comments.length}
                                                </small>
                                            </Card.Text>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleLike(blog._id)}
                                            >
                                                {blog.likes.includes(localStorage.getItem("userId") || "")
                                                    ? "Unlike"
                                                    : "Like"}
                                            </Button>
                                            <Form.Group className="mt-3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={comments[blog._id] || ""}
                                                    onChange={(e) =>
                                                        setComments((prev) => ({
                                                            ...prev,
                                                            [blog._id]: e.target.value,
                                                        }))
                                                    }
                                                />
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => handleAddComment(blog._id)}
                                                >
                                                    Comment
                                                </Button>
                                            </Form.Group>
                                            <div className="mt-3">
                                                <h6>Comments:</h6>
                                                {blog.comments.length === 0 ? (
                                                    <p className="text-muted">No comments yet.</p>
                                                ) : (
                                                    blog.comments.map((comment, index) => (
                                                        <div key={index} className="mb-2">
                                                            <strong>
                                                                {comment.user?.name || "Anonymous"}
                                                            </strong>: {comment.comment}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => handleVisibility(blog)}
                                            >
                                                Show Blog
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Blogs;
