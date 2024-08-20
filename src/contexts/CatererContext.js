import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CatererContext = createContext();

export const useCaterer = () => {
    const context = useContext(CatererContext);
    if (!context) {
        throw new Error('useCaterer must be used within a CatererProvider');
    }
    return context;
};

export const CatererProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [catererId, setCatererId] = useState(sessionStorage.getItem('catererId') || localStorage.getItem('catererId') || '');
    const [catererData, setCatererData] = useState(null);
    const [serviceId, setServiceId] = useState(sessionStorage.getItem('serviceId') || '');
    const [services, setServices] = useState(JSON.parse(sessionStorage.getItem('services')) || []);
    const [menuItems, setMenuItems] = useState(JSON.parse(sessionStorage.getItem('menuItems')) || []);
    const [caterers, setCaterers] = useState([]);
    

    const fetchCatererIdAndData = useCallback(async (userId) => {
        try {
            console.log('Fetching caterer for userId:', userId);

            const response = await axios.get(`http://localhost:3010/api/caterers/users/${userId}`,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            });
            console.log("Caterer:", response.data);
            const caterer = response.data;

            if (caterer && caterer._id) {
                const retrievedCatererId = caterer._id;
                setCatererId(retrievedCatererId);
                setCatererData(caterer);

                sessionStorage.setItem('catererId', retrievedCatererId);
                localStorage.setItem('catererId', retrievedCatererId);
            } else {
                resetCaterer();
                console.log('Caterer not found');
            }
        } catch (error) {
            console.error('Error fetching caterer by userId:', error);
            resetCaterer();
        }
    }, []);

    const fetchCatererData = useCallback(async (userId, catererId) => {
        try {
            const response = await axios.get(`http://localhost:3010/api/caterers/${catererId}`);

            const caterer = response.data;

            if (caterer) {
                setCatererData(caterer);
                sessionStorage.setItem('catererId', caterer._id);
            } else {
                resetCaterer();
            }
        } catch (error) {
            console.error('Error fetching caterer:', error);
            resetCaterer();
        }
    }, []);

    const fetchCaterers = async () => {
        try {
          const response = await axios.get('http://localhost:3010/api/caterers');
          if (response && response.data) {
            setCaterers(response.data);
            localStorage.setItem('caterers', JSON.stringify(response.data))
            console.log('Caterers fetched:', response.data);
          }
        } catch (error) {
          console.error('Error fetching caterers:', error);
        }
      };

      useEffect(() => {
        const storedCaterers = localStorage.getItem('caterers');
        if (storedCaterers) {
            setCaterers(JSON.parse(storedCaterers)); 
            console.log('Caterers loaded from storage:', JSON.parse(storedCaterers));
        } else {
            fetchCaterers(); 
        }
        }, []);
    

    const fetchServices = useCallback(async (catererId) => {
        try {
            const response = await axios.get(`http://localhost:3010/api/services/caterer/${catererId}`);

            const services = response.data;

            if (services) {
                setServices(services);
                sessionStorage.setItem('services', JSON.stringify(services));
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            resetCaterer();
        }
    }, []);

    const fetchMenuItems = useCallback(async (catererId) => {
        try {
            const response = await axios.get(`http://localhost:3010/api/menuItem/caterer/${catererId}`);

            const menuItems = response.data;

            if (menuItems) {
                setMenuItems(menuItems);
                sessionStorage.setItem('menuItems', JSON.stringify(menuItems));
                console.log("Menu Items fetched:", response.data);
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
            resetCaterer();
        }
    }, []);

    const updateMenuItems = async () => {
        try {
          const response = await axios.get('http://localhost:3010/api/menuItem');
          setMenuItems(response.data);
        } catch (error) {
          console.error('Error updating menu items:', error);
        }
      };

    const fetchAllCaterers = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3010/api/caterers');
            const allCaterers = response.data;

            if (allCaterers) {
                setCaterers(allCaterers);
                sessionStorage.setItem('caterers', JSON.stringify(allCaterers));
            }
        } catch (error) {
            console.error('Error fetching all caterers:', error);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            if (catererId) {
                fetchCatererData(userId, catererId);
            } else {
                fetchCatererIdAndData(userId);
            }
        }
    }, [userId, catererId, fetchCatererData, fetchCatererIdAndData]);

 

    useEffect(() => {
        fetchAllCaterers();
    }, [fetchAllCaterers]);

    const resetCaterer = () => {
        setCatererId('');
        setCatererData(null);
        setServices([]);
        setMenuItems([]);
        sessionStorage.removeItem('catererId');
        sessionStorage.removeItem('services');
        sessionStorage.removeItem('menuItems');
        localStorage.removeItem('catererId');
        localStorage.removeItem('caterers')
    };

    return (
        <CatererContext.Provider value={{ 
            userId, 
            setUserId, 
            catererId, 
            setCatererId, 
            catererData, 
            setCatererData, 
           
            setCaterers,
            serviceId, 
            setServiceId, 
            services, 
            setServices,
            menuItems,
            setMenuItems,
            caterers,
            setCaterers,
            resetCaterer ,
            fetchAllCaterers,
            fetchServices,
            fetchMenuItems,
            updateMenuItems
        }}>
            {children}
        </CatererContext.Provider>
    );
};
