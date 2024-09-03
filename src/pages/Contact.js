import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/Auth'; // Assume you have a context for user roles

const Contact = () => {
    const { user } = useAuth(); // Access user info from context

    console.log('user data',user)

    return (
        <div>
            <h1>Contact</h1>
            {user.role === 'customer' && (
                <div>
                    <h2>Customer Options</h2>
                    <ul>
                        <li>
                            <Link to="/enquiries/customers">View My Enquiries</Link>
                        </li>
                        <li>
                            <Link to={`/chat/${user._id}`}>Start Chat with Caterers</Link>
                        </li>
                    </ul>
                </div>
            )}
            {user.role === 'caterer' && (
                <div>
                    <h2>Caterer Options</h2>
                    <ul>
                        <li>
                            <Link to="/enquiries/caterers">View Received Enquiries</Link>
                        </li>
                        <li>
                            <Link to={`/chat/${user._id}`}>Manage Chat with Customers</Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Contact;
