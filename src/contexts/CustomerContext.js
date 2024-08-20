import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => {
  return useContext(CustomerContext);
};

export const CustomerProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  

  return (
    <CustomerContext.Provider value={{ userId, setUserId}}>
      {children}
    </CustomerContext.Provider>
  );
};


