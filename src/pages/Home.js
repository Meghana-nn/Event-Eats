import React from 'react';
import { useAuth } from "../contexts/Auth";
import { Navigate } from 'react-router-dom';

export default function Home() {
    const { user } = useAuth();

    if (!user) {
        return <p>User not logged in</p>;
    }

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" />;
        case 'caterer':
            return <Navigate to={`/caterer/login/${user._id}`} />;
        case 'guest':
            return <Navigate to="/guest-home" />;
        default:
            return <p>Welcome {user.username}</p>;
    }
}
