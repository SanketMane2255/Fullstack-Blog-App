
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const BlogEditByAdmin = ({ handleClose, blog }) => {
    const [title, setTitle] = useState(blog.title || "");
    const [content, setContent] = useState(blog.content || "");


    const updateData = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:4000/api/blog/updateBlog/${blog._id}`, { title, content }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            handleClose();
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div>
            <Form onSubmit={updateData}>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        value={title}
                        type="text"
                        placeholder="Title of the Blog"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        value={content}
                        type="text"
                        placeholder="Content of the Blog"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Update
                </Button>
            </Form>
        </div >
    );
};

export default BlogEditByAdmin;
