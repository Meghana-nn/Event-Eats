import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCaterer } from '../../contexts/CatererContext';

const CatererEnquiry = () => {
    const { catererId } = useCaterer();
    const [enquiries, setEnquiries] = useState([]);
    const [response, setResponse] = useState('');

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await axios.get(`http://localhost:3010/api/enquiries/caterer/${catererId}`);
                setEnquiries(response.data);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            }
        };
        fetchEnquiries();
    }, [catererId]);

    const handleSendResponse = async (enquiryId) => {
        if (response.trim() === '') return;

        try {
            const responseData = {
                responses: response
            };
            await axios.put(`http://localhost:3010/api/enquiries/${enquiryId}`, responseData);
            setResponse('');
        } catch (error) {
            console.error('Error sending response:', error);
        }
    };

    return (
        <div>
            <h1>Caterer Enquiry</h1>
            <ul>
                {enquiries.map((enquiry) => (
                    <li key={enquiry.id}>
                        <p>{enquiry.message}</p>
                        <input
                            type="text"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response"
                        />
                        <button onClick={() => handleSendResponse(enquiry.id)}>Send Response</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CatererEnquiry;
