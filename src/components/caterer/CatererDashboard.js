import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CatererProvider } from '../../contexts/CatererContext';
import Sidebar from '../../pages/Sidebar';
import CatererForm from './CatererForm';
import CatererMenu from '../caterer/CatererMenu';
import CatererService from '../caterer/CatererService';
import CatererDetails from '../caterer/CatererDetails';
import WaitingPage from '../../pages/WaitingPage';
import '../../components/caterer/Caterer.css';

function CatererDashboard() {
  return (
    <div className="dashboard">
      <CatererProvider>
      <Sidebar className="sidebar" />
      <Routes>

      
      <Route path="caterer/form" element={<CatererForm />} />
        <Route path="caterer/menu" element={<CatererMenu />} />
        <Route path="caterer/service/:serviceId" element={<CatererService />} />
        <Route path="caterer/details" element={<CatererDetails />} />
        
        <Route path="waiting" element={<WaitingPage />} />
      </Routes>
      </CatererProvider>
    </div>
  );
}

export default CatererDashboard;
