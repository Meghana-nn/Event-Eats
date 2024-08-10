import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { useAuth } from '../contexts/Auth';
import validator from 'validator';
import './Login.css'
import backgroundImage from '../assets/login-backgroun-1.jpg'

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
                console.log("Response from login endpoint:", response); // Logging the response

                const token = response.data.token;
                localStorage.setItem('token', token);
                console.log(token)

                const userResponse = await axios.get('http://localhost:3010/api/users/account', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log("Response from account endpoint:", userResponse); // Logging the user data
                handleLogin(userResponse.data);

                
                const userRole = userResponse.data.role;
                const userId = userResponse.data._id;
                console.log(userRole)
                
                if (userRole === 'admin') {
                    navigate('/admin');
                } else if (userRole === 'caterer') {
                    sessionStorage.setItem('userId', userId);
                    navigate(`/login/caterer/${userId}`);
                } else {
                    navigate('/');
                }
            } catch (err) {
                console.error("Error during login", err);
            }
        }
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({ ...form, [name]: value });
    };

    return (
        <div className="login-page">
            {/* <div className="w-screen h-screen relative overflow-hidden flex">
                <img src={backgroundImage} alt='background'/>
                </div> */}
            {/* <div className='flex flex-col items-left bg-slate-200 w-[20%] md:w-588 h-full z-10 background-blur-md'>
            </div> */}
            
            <div className="login-container">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label htmlFor="email" className="form-label">Enter email</label>
                            <input type="text" value={form.email} onChange={handleChange} name="email" id="email" className={`form-control ${form.clientErrors.email ? 'is-invalid' : ''}`} />
                            {form.clientErrors.email && <div className="invalid-feedback">{form.clientErrors.email}</div>}
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password" className="form-label">Enter password</label>
                            <input type="password" value={form.password} onChange={handleChange} name="password" id="password" className={`form-control ${form.clientErrors.password ? 'is-invalid' : ''}`} />
                            {form.clientErrors.password && <div className="invalid-feedback">{form.clientErrors.password}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    <div className="login-form-group">
                        <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}