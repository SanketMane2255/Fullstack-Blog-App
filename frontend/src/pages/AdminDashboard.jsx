import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Edit from './UserEditByAdmin';
import BlogEdit from './BlogEditByAdmin'; // Component to handle blog editing

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showBlogModal, setShowBlogModal] = useState(false);

    // ****************************** USER FUNCTIONS ******************************* //
    const handleUserClose = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const handleUserShow = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:4000/api/admin/getAllUsers`, config);
                setUsers(response.data);
                setError("");
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load users");
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/admin/deleteUser/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter((user) => user._id !== userId));
            setBlogs(blogs.filter((blog) => blog._id !== blog))
        } catch (error) {
            console.error("Error occurred while deleting user:", error);
        }
    };

    // ****************************** BLOG FUNCTIONS ******************************* //
    const handleBlogClose = () => {
        setShowBlogModal(false);
        setSelectedBlog(null);
    };

    const handleBlogShow = (blog) => {
        setSelectedBlog(blog);
        setShowBlogModal(true);
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/blog/getAllBlogs`);
                setBlogs(response.data.blog || []);
                setError("");
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load blogs");
            }
        };

        fetchBlogs();
    }, []);

    const deleteBlog = async (blogId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/blog/deleteBlog/${blogId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBlogs(blogs.filter((blog) => blog._id !== blogId));
        } catch (error) {
            console.error("Error occurred while deleting blog:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            
            {/* USER TABLE */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action-1</th>
                        <th>Action-2</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleUserShow(user)}>
                                    Edit
                                </Button>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => deleteUser(user._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* BLOG TABLE */}
            <div className="mt-5">
                <h3>Blogs Table</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Author</th>
                            <th>Action-1</th>
                            <th>Action-2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog._id}>
                                <td>{blog.title}</td>
                                <td>{blog.content}</td>
                                <td>{blog.author?.name || "Unknown Author"}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleBlogShow(blog)}>
                                        Edit
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteBlog(blog._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* USER EDIT MODAL */}
            <Modal show={showUserModal} onHide={handleUserClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && <Edit user={selectedUser} handleClose={handleUserClose} />}
                </Modal.Body>
            </Modal>

            {/* BLOG EDIT MODAL */}
            <Modal show={showBlogModal} onHide={handleBlogClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBlog && <BlogEdit blog={selectedBlog} handleClose={handleBlogClose} />}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminDashboard;



