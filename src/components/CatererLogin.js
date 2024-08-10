import React from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/caterer-login.jpg';
import '../components/Caterer.css';

function CatererLogin({ user }) { // Accept caterer as a prop
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/caterer'); // Update the path as needed
  };

  return (
    <div className='image'>
      <img src={bgImage} alt="Background" />
      <div className='overlay'>
        <div className='text'>
          <h1>welcome caterer {user ? user.name : 'Guest'}</h1>
          <Button className='login-button' onClick={handleClick}>
            Please log in to continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CatererLogin;
