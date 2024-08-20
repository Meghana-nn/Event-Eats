import React from 'react'
import { useAuth } from "../contexts/Auth";
import { Navigate } from 'react-router-dom';

function Event() {
  const { user } = useAuth();
  if (!user) {
    return <p>User not logged in</p>;
}

switch (user.role) {
    case 'admin':
        return <Navigate to="/admin" />;
    case 'caterer':
        return <Navigate to={`/caterer`} />;
    case 'customer':
        return <Navigate to={`/customers/events`} />;
        
    default:
        return <p>Welcome {user.username}</p>;
}
}

export default Event
