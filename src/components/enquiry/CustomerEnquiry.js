import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCustomer } from '../../contexts/CustomerContext';

const CustomerEnquiry = () => {
    const { customerId } = useCustomer();
    const [caterers, setCaterers] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedCatererId, setSelectedCatererId] = useState(null);

    useEffect(() => {
        const fetchCaterers = async () => {
            try {
                const response = await axios.get('http://localhost:3010/api/caterers');
                setCaterers(response.data);
            } catch (error) {
                console.error('Error fetching caterers:', error);
            }
        };
        fetchCaterers();
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() === '' || !selectedCatererId) return;

        const messageData = {
            customerId,
            catererId: selectedCatererId,
            message
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3010/api/enquiries', messageData, {
                headers: {
                    Authorization: token
                }
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>Customer Enquiry</h1>
            <ul>
                {caterers.map((caterer) => (
                    <li key={caterer.id}>
                        <button onClick={() => setSelectedCatererId(caterer.id)}>
                            {caterer.name}
                        </button>
                    </li>
                ))}
            </ul>
            {selectedCatererId && (
                <div>
                    <h2>Send Enquiry to {caterers.find(caterer => caterer.id === selectedCatererId)?.name}</h2>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default CustomerEnquiry;
