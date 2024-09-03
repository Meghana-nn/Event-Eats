import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestNavigate = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/customers/events/fetch');
    };

    return (
        <button onClick={handleClick}>Test Navigation</button>
    );
};

export default TestNavigate;
