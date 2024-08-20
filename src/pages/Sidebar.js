import React, { useState, useEffect,  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCaterer } from '../contexts/CatererContext';
import CatererForm from '../components/caterer/CatererForm';
import CatererMenu from '../components/caterer/CatererMenu';
import CatererDetails from '../components/caterer/CatererDetails';
import CatererService from '../components/caterer/CatererService';
import '../App.css';

const Sidebar = () => {
  const location = useLocation();
  const { catererId,userId } = useCaterer(); // Removed catererId

  const [select, setSelect] = useState('');

  console.log('caterer id', catererId);
  console.log('user id',userId)

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setSelect(path);

    if (!catererId) {
      console.error('caterer ID is null');
    }
  }, [location, catererId]);

  const render = () => {
    switch (select) {
      case 'form':
        return <CatererForm />; // No need to pass userId as prop
      case 'menu':
        return <CatererMenu />;
      case 'service':
        return <CatererService />;
      case 'details':
        return <CatererDetails />;
      default:
        return <div className='sidebar-text'>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className='container'>
      <div className='sidebarSection'>
        <ul>
          <li>
            <Link to={`/caterer/form`}>Caterer Form</Link>
          </li>
          <li>
            <Link to={`/caterer/menu`}>Caterer Menu</Link>
          </li>
          <li>
            <Link to={`/caterer/service`}>Add Services</Link>
          </li>
          <li>
            <Link to={`/caterer/details`}>Caterer Details</Link>
          </li>
        </ul>
      </div>
      <div className='contentSection'>
        {render()}
      </div>
    </div>
  );
};

export default Sidebar;
