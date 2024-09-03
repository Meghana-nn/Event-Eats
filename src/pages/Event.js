import React, { useEffect } from 'react';
import { useAuth } from "../contexts/Auth";
import { useNavigate } from 'react-router-dom';

function Event() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'caterer':
        navigate('/caterer/events');
        break;
      case 'customer':
        navigate('/customers/events/home');
        break;
      default:
        break;
    }
  }, [user, navigate]);

  if (!user) {
    return <p>User not logged in</p>;
  }

  return <p>Welcome {user.username}</p>;
}

export default Event;
