
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const [comments, setComments] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await axios.get("http://localhost:4000/api/blog/getALLBlogs"
                    , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );

                setBlogs(response.data.blog);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load blogs");
            }
        };

        fetchBlogs();
    }, [navigate]);

    const handleLike = async (blogId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:4000/api/blog/${blogId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
        const currentComment = comments[blogId]?.trim();
        if (!currentComment) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `http://localhost:4000/api/blog/${blogId}/comment`,
                { comment: currentComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

    return (
        <div>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Blogs</h2>
                {error && <p className="text-danger text-center">{error}</p>}

                <div className="row">
                    {blogs.length === 0 ? (
                        <p className="text-center">No blogs available</p>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{blog.title}</h5>
                                        <p className="card-text">{blog.content}</p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Author: {blog.author?.name || "Unknown"}
                                            </small>
                                        </p>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                Likes: {blog.likes.length}, Comments: {blog.comments.length}
                                            </small>
                                        </p>
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2"
                                            onClick={() => handleLike(blog._id)}
                                        >
                                            {blog.likes.includes(localStorage.getItem("userId") || "")
                                                ? "Unlike"
                                                : "Like"}
                                        </button>

                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Add a comment..."
                                                value={comments[blog._id] || ""}
                                                onChange={(e) =>
                                                    setComments((prev) => ({
                                                        ...prev,
                                                        [blog._id]: e.target.value,
                                                    }))
                                                }
                                            />
                                            <button
                                                className="btn btn-sm btn-primary mt-2"
                                                onClick={() => handleAddComment(blog._id)}
                                            >
                                                Comment
                                            </button>
                                        </div>
                                        <div className="mt-3">
                                            <h6>Comments:</h6>
                                            {blog.comments.length === 0 ? (
                                                <p className="text-muted">No comments yet.</p>
                                            ) : (
                                                blog.comments.map((comment, index) => (
                                                    <div key={index} className="mb-2">
                                                        <strong>{comment.user?.name || "Anonymous"}</strong>:{" "}
                                                        {comment.comment}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blogs;


