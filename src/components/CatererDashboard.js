import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route } from 'react-router-dom';
import Sidebar from '../pages/Sidebar';
import CatererForm from '../components/CatererForm';
import CatererMenu from '../components/menu/CatererMenu';
import CatererService from '../components/CatererService';
import CatererDetails from '../components/CatererDetails';
import WaitingPage from '../pages/WaitingPage';
import { useAuth } from '../contexts/Auth'; // Adjust the path as necessary
import '../components/Caterer.css'

function CatererDashboard() {
  const { catererId: paramCatererId } = useParams();
  const [catererId, setCatererId] = useState(null);
  const { user } = useAuth(); // Access authentication context

  useEffect(() => {
    // Retrieve userId from localStorage and catererId from sessionStorage or localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedCatererId = sessionStorage.getItem('catererId') || localStorage.getItem('catererId');

    if (storedCatererId) {
      setCatererId(storedCatererId);
    } else if (paramCatererId) {
      // If catererId is not available but URL param is present
      sessionStorage.setItem('catererId', paramCatererId);
      localStorage.setItem('catererId', paramCatererId);
      setCatererId(paramCatererId);
    }
  }, [paramCatererId]);

  return (
    <div className="dashboard">
      <Sidebar className="sidebar"catererId={catererId} />
      <div className="main-content">
        <Routes>
          <Route path="form" element={<CatererForm catererId={catererId} />} />
          <Route path="menu" element={<CatererMenu catererId={catererId} />} />
          <Route path="service/:serviceId" element={<CatererService catererId={catererId} />} />
          <Route path="details/:catererId" element={<CatererDetails catererId={catererId} />} />
          <Route path="waiting" element={<WaitingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default CatererDashboard;
