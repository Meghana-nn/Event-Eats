import React, { createContext, useContext, useState } from 'react';

const CatererContext = createContext();
export const useCatererContext = () => 
    {
        return useContext(CatererContext)
}

export const CatererProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [serviceData, setServiceData] = useState([]);

  return (
    <CatererContext.Provider value={{ formData, setFormData, serviceData, setServiceData }}>
      {children}
    </CatererContext.Provider>
  );
};


