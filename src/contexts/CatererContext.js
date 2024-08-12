import React, { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        if (userId) {
            if (catererId) {
                fetchCatererData(userId, catererId);
            } else {
                fetchCatererIdAndData(userId);
            }
        }
    }, [userId]);

    const fetchCatererIdAndData = async (userId) => {
        try {
          const token=localStorage.getItem('token')
            const response = await axios.get(`http://localhost:3010/api/caterers/users/${userId}`,{
              headers: { Authorization: token },
            });
            console.log('response-sidebar',response)
         
            const caterer = response.data;

            if (caterer && caterer._id) {
                const retrievedCatererId = caterer._id;
                setCatererId(retrievedCatererId);
                setCatererData(caterer);

                // Store the catererId in both sessionStorage and localStorage
                sessionStorage.setItem('catererId', retrievedCatererId);
                localStorage.setItem('catererId', retrievedCatererId);
            } else {
                resetCaterer(); // If no caterer is found, reset
            }
        } catch (error) {
            console.error('Error fetching caterer by userId:', error);
            resetCaterer(); // Handle error by resetting the caterer data
        }
    };

    const fetchCatererData = async (userId, catererId) => {
        try {
          const token=localStorage.getItem('token')
            const response = await axios.get(`http://localhost:3010/api/caterers/${catererId}`,{
              headers: { Authorization: token },
            });
            
            const caterer = response.data;

            if (caterer) {
                setCatererData(caterer);
                sessionStorage.setItem('catererId', caterer._id); // Ensure sessionStorage is up to date
            } else {
                resetCaterer(); // Handle case where caterer doesn't exist anymore
            }
        } catch (error) {
            console.error('Error fetching caterer:', error);
            resetCaterer();
        }
    };

    const resetCaterer = () => {
        setCatererId('');
        setCatererData(null);
        sessionStorage.removeItem('catererId');
        localStorage.removeItem('catererId');
    };

    return (
        <CatererContext.Provider value={{ userId, setUserId, catererId, setCatererId, catererData, setCatererData, resetCaterer }}>
            {children}
        </CatererContext.Provider>
    );
};
