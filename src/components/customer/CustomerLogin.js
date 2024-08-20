import React from 'react';
import { useCustomer } from '../../contexts/CustomerContext'; 
import LandingPage from '../../pages/LandingPage';

function CustomerLogin() {
  const { userId } = useCustomer(); 

  return (
    <div>
     
      
      <LandingPage/>
    </div>
  );
}

export default CustomerLogin;
