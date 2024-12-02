
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const UserEditByAdmin = ({ handleClose, user }) => {
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");


    const updateData = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:4000/api/admin/updateUser/${user._id}`, { name, email }, {
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        type="text"
                        placeholder="Name of the user"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
                        type="text"
                        placeholder="Email of the User"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Update
                </Button>
            </Form>
        </div >
    );
};

export default UserEditByAdmin;
