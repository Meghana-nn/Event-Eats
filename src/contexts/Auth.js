import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user from localStorage if available
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
   

    const handleLogin = (user) => {
        // Store user details in local storage
        localStorage.setItem('userId', user._id);
        localStorage.setItem('user', JSON.stringify(user));
        if (user.catererId) {
            sessionStorage.setItem('catererId', user.catererId);
            localStorage.setItem('services')
            sessionStorage.setItem('menuItems')
        }
        setUser(user);
    };

    const handleLogout = () => {
        // Clear user data and token from local storage
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        sessionStorage.removeItem('catererId');
        localStorage.removeItem('catererId');
        sessionStorage.removeItem('serviceId')
        localStorage.removeItem('services')
        localStorage.removeItem('caterers')
        sessionStorage.removeItem('menuItems')
        
    };

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
