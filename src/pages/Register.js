import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import validator from 'validator'
export default function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    // const[serverErrors, setServerErrors] = useState(null)
    const[clientErrors, setClientErrors] = useState({})
const runValidations = () => {
    const errors ={}
    if(username.trim().length === 0) {
        errors.username = 'username is required'
    }
    if(email.trim().length === 0) {
        errors.email = 'email is required'
    } else if(!validator.isEmail(email)) {
        errors.email = 'invalid email format'
    }

    if(password.trim().length === 0) {
        errors.password = 'password is required'
    } else if(password.trim().length < 8 || password.trim().length > 128) {
        errors.password = 'password should be between 8 - 128 characters'
    }

    if(role.trim().length === 0) {
        errors.role = 'role is required'
    }
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = runValidations();

    if (isValid) {
        const formData = {
            username,
            email,
            password,
            role
        };

        try {
            // Make the API request to register the user
            const response = await axios.post('http://localhost:3010/api/users/register', formData);
            console.log('Registration successful:', response.data);

            // Clear form fields
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("");

            // Navigate to the success page
            navigate("/success");
        } catch (error) {
            console.error('Error during registration:', error);
            // Optionally, you can display an error message to the user
        }
    }
};

    return ( 
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Enter Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} id="username" className={`form-control ${clientErrors.username ? 'is-invalid' : ''}`} />
                            {clientErrors.username && <div className="invalid-feedback">{clientErrors.username}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Enter email</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="email" className={`form-control ${clientErrors.email ? 'is-invalid' : ''}`} />
                            {clientErrors.email && <div className="invalid-feedback">{clientErrors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Enter password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className={`form-control ${clientErrors.password ? 'is-invalid' : ''}`} />
                            {clientErrors.password && <div className="invalid-feedback">{clientErrors.password}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select Role</label>
                            <br />
                            <div className="form-check form-check-inline">
                                <input type="radio" value="admin" onChange={(e) => setRole(e.target.value)} checked={role === 'admin'} id="admin" name="role" className="form-check-input" />
                                <label htmlFor="admin" className="form-check-label">Admin</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="radio" value="caterer" onChange={(e) => setRole(e.target.value)} checked={role === 'caterer'} id="caterer" name="role" className="form-check-input" />
                                <label htmlFor="caterer" className="form-check-label">Caterer</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="radio" value="customer" onChange={(e) => setRole(e.target.value)} checked={role === 'customer'} id="customer" name="role" className="form-check-input" />
                                <label htmlFor="customer" className="form-check-label">Customer</label>
                            </div>
                            {clientErrors.role && <div className="invalid-feedback">{clientErrors.role}</div>}
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}


    