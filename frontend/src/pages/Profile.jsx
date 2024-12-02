
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [blogCount, setBlogCount] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // JWT from local storage
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get('http://localhost:4000/api/user/profile', config);

                //console.log(response)

                setUser(response.data.user);
                setBlogs(response.data.blogs);
                setBlogCount(response.data.blogCount);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.response?.data?.message || 'Failed to load profile');
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = (blogId) => {
        // Navigate to the EditBlog component with the blogId as a route parameter
        navigate(`/edit-blog/${blogId}`);
    };

    const handleDelete = async (blogId) => {
        try {
            const token = localStorage.getItem('token'); // JWT from local storage
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
            await axios.delete(`http://localhost:4000/api/blog/${blogId}/delete`,config);
            setBlogs(blogs.filter((blog) => blog._id !== blogId));
        } catch (error) {
            console.error('Error deleting blog', error);
        }
    };

    return (
        <div className="profile container mt-5">
            <h1 className="text-center mb-4">{user.name}'s Profile</h1>
            <p className="text-center">Email: {user.email}</p>
            <p className="text-center">Total Blogs: {blogCount}</p>

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
                                            Likes: {blog.likes.length}, Comments: {blog.comments.length}
                                        </small>
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleEdit(blog._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(blog._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;


