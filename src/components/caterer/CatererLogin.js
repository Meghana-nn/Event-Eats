import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCaterer } from '../../contexts/CatererContext';
import bgImage from '../../assets/caterer-login.jpg';
import '../../components/caterer/Caterer.css';

function CatererLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCatererId, fetchCatererData, userId } = useCaterer();
  const user = location.state?.user; // Retrieve user from location state

  useEffect(() => {
    if (user) {
      // Set caterer ID and fetch data
      setCatererId(user._id);
      fetchCatererData(user._id);
    }
  }, [user, setCatererId, fetchCatererData]);

  const handleClick = () => {
    // Navigate to the caterer dashboard or another page
    navigate('/caterer');
  };

  return (
    <div className='caterer-image'>
      <Link to={`/caterer/login/${userId}`} className="text-2xl text-slate-500" style={{ color: 'black', }}></Link>
      <img src={bgImage} alt="Background" />
      <div className='overlay'>
        <div className='text'>
          <h4>Welcome caterer {user ? user.name : '!!'}</h4>
          <Button className='login-button' onClick={handleClick}>
            <h6>Continue</h6>
          </Button>
          {/* Use the following Link component if you want to provide a direct link */}
          
            
        </div>
      </div>
    </div>
  );
}

export default CatererLogin;
