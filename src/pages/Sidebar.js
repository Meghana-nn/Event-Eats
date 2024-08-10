import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';
import CatererForm from '../components/CatererForm';
import CatererMenu from '../components/menu/CatererMenu';
import CatererDetails from '../components/CatererDetails';
import CatererService from '../components/CatererService';

const Sidebar = ({catererId}) => {
  const location = useLocation();
  
  const [select, setSelect] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setSelect(path);
  }, [location]);

  const render = () => {
    switch (select) {
      case 'form':
        return <CatererForm />;
      case 'menu':
        return <CatererMenu />;
      case 'service':
        return <CatererService />;
      case 'details':
        return <CatererDetails />;
      default:
        return <div></div>;
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
}

export default Sidebar;
