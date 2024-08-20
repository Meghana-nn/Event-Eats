import React from 'react';
import { useAuth } from '../contexts/Auth';
import { Navigate } from 'react-router-dom';

export default function Menu() {
    const { user } = useAuth();
    
    console.log('User data:', user);

    if (!user) {
        console.log('No user found, showing "User not logged in"');
        return <p>User not logged in</p>;
    }

    console.log('User role:', user.role);

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" replace />;
        case 'caterer':
            return <Navigate to={`/caterer/list/menu`} replace />;
        case 'customer':
            return <Navigate to={`/customers/list/menu`} replace />;
        default:
            return <p>Welcome to the Menu, {user.username}!</p>;
    }
}

