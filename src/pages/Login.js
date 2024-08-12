import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { useAuth } from '../contexts/Auth';
import validator from 'validator';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [form, setForm] = useState({
        email: '',
        password: '',
        clientErrors: {},
        serverError: null
    });

    const runValidations = () => {
        const errors = {};
        if (form.email.trim().length === 0) {
            errors.email = 'Email is required';
        } else if (!validator.isEmail(form.email)) {
            errors.email = 'Invalid email format';
        }

        if (form.password.trim().length === 0) {
            errors.password = 'Password is required';
        } else if (form.password.trim().length < 8 || form.password.trim().length > 128) {
            errors.password = 'Password should be between 8 - 128 characters';
        }
        setForm({ ...form, clientErrors: errors });

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = _.pick(form, ['email', 'password']);
        const isValid = runValidations();

        if (isValid) {
            try {
                const response = await axios.post('http://localhost:3010/api/users/login', formData);
                const token = response.data.token;
                localStorage.setItem('token', token);
                console.log(token)

                const userResponse = await axios.get('http://localhost:3010/api/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                handleLogin(userResponse.data);

                console.log(userResponse)

                const userRole = userResponse.data.role;
                const userId = userResponse.data._id;
                console.log(userRole)
                console.log('user id',userId)

                if (userRole === 'admin') {
                    navigate('/admin');
                } else if (userRole === 'caterer') {
                    sessionStorage.setItem('userId', userId);
                    navigate(`/caterer/login/${userId}`);
                } else {
                    navigate('/');
                }
            } catch (err) {
                console.error("Error during login", err);
                setForm({ ...form, serverError: 'Login failed. Please try again.' });
            }
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value });
    };

    return (
        
           <div className="login-page">
            <div className="background-wrapper">
            <div className="login-container">
                     <div className="login-form">
                    <h2>Login</h2>
                    <Form onSubmit={handleSubmit}>
                        {form.serverError && <Alert color="danger">{form.serverError}</Alert>}
                        <FormGroup>
                            <Label for="email">Email:</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder='Enter valid email'
                                value={form.email}
                                onChange={handleChange}
                                invalid={!!form.clientErrors.email}
                            />
                            {form.clientErrors.email && <div className="invalid-feedback">{form.clientErrors.email}</div>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password:</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder='Enter password'
                                value={form.password}
                                onChange={handleChange}
                                invalid={!!form.clientErrors.password}
                            />
                            {form.clientErrors.password && <div className="invalid-feedback">{form.clientErrors.password}</div>}
                        </FormGroup>
                        <Button color="primary" type="submit">Login</Button>
                    </Form>
                    <div className="login-form-group">
                        <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
        </div>
       
    );
}
