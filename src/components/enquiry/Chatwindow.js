import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useCustomer } from '../../contexts/CustomerContext';
import { useCaterer } from '../../contexts/CatererContext';
import { useAuth } from '../../contexts/Auth';
import './ChatWindow.css';

const socket = io('http://localhost:3010'); 

const ChatWindow = () => {
    const { customerId } = useCustomer();
    const { catererId, setCatererId } = useCaterer();
    const { user } = useAuth();
    const [caterers, setCaterers] = useState([]);
    const [customers, setCustomers] = useState([]); // Added customers state
    const [enquiries, setEnquiries] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

    useEffect(() => {
        if (customerId && user.role === 'customer') {
            const fetchCaterers = async () => {
                try {
                    const response = await axios.get('http://localhost:3010/api/caterers');
                    setCaterers(response.data);
                } catch (error) {
                    console.error('Error fetching caterers:', error);
                }
            };
            fetchCaterers();
        }
    }, [customerId, user.role]);

    useEffect(() => {
        if (catererId && user.role === 'caterer') {
            const fetchEnquiries = async () => {
                try {
                    const response = await axios.get(`http://localhost:3010/api/enquiries/caterer/${catererId}`);
                    setEnquiries(response.data);
                } catch (error) {
                    console.error('Error fetching enquiries:', error);
                }
            };
            fetchEnquiries();
        }
    }, [catererId, user.role]);

    useEffect(() => {
        if (user.role === 'caterer') {
            const fetchCustomers = async () => {
                try {
                    const response = await axios.get('http://localhost:3010/api/customers');
                    setCustomers(response.data);
                } catch (error) {
                    console.error('Error fetching customers:', error);
                }
            };
            fetchCustomers();
        }
    }, [user.role]);

    useEffect(() => {
        if (customerId && catererId) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://localhost:3010/api/enquiries/messages/${customerId}/${catererId}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [customerId, catererId]);

    useEffect(() => {
        if (customerId && catererId) {
            socket.emit('joinRoom', { customerId, catererId });

            socket.on('message', (messageData) => {
                setMessages((prevMessages) => [...prevMessages, messageData]);
            });

            return () => {
                socket.off('message');
            };
        }
    }, [customerId, catererId]);

    const handleSendMessage = async () => {
        if (message.trim() === '' || !customerId || !catererId) return;

        const messageData = {
            customerId,
            catererId,
            message
        };

        try {
            const token = localStorage.getItem('token');
            socket.emit('sendMessage', messageData);

            const response = await axios.post('http://localhost:3010/api/enquiries', messageData, {
                headers: {
                    Authorization: token
                }
            });
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSendResponse = async () => {
        if (response.trim() === '' || !selectedEnquiryId) return;

        try {
            const responseData = {
                responses: response
            };

            const updateResponse = await axios.put(`http://localhost:3010/api/enquiries/response/${selectedEnquiryId}`, responseData);
            setResponse('');
            setSelectedEnquiryId(null);

            setEnquiries((prevEnquiries) => 
                prevEnquiries.map(enquiry => 
                    enquiry._id === selectedEnquiryId ? updateResponse.data : enquiry
                )
            );

        } catch (error) {
            console.error('Error sending response:', error);
        }
    };

    return (
        <div className='chat-container'>
            {user.role === 'customer' && customerId && (
                <>
                    <div className="caterers-list">
                        <h6>Select a Caterer</h6>
                        <ul>
                            {caterers.map(caterer => (
                                <li key={caterer._id}>
                                    <button
                                        className={`caterer-button ${catererId === caterer._id ? 'active' : ''}`}
                                        onClick={() => setCatererId(caterer._id)}
                                    >
                                        {caterer.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {catererId && (
                        <div className="customer-chat-box">
                            <h6>Chat with Caterer</h6>
                            <div className="customer-messages-container">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div key={msg._id} className="message-row">
                                            <div className="customer-message">
                                                <strong>{msg.customerId === customerId ? 'You' : 'Caterer'}:</strong>
                                                <p>{msg.message}</p>
                                            </div>
                                            {msg.responses && (
                                                <div className="customer-response">
                                                    <strong>Caterer:</strong>
                                                    <p>{msg.responses}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                            </div>
                            <div className="customer-input-container">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message"
                                    className="input-field"
                                />
                                <button onClick={handleSendMessage} className="send-button">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {user.role === 'caterer' && catererId && (
                <>
                    <div className="customers-list">
                        <h6>Customers</h6>
                        <ul>
                            {customers.map(customer => (
                                <li key={customer._id}>
                                    <button
                                        className="customer-button"
                                        onClick={() => setCatererId(customer._id)}
                                    >
                                        {customer.username}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="caterer-chat-box">
                        <h6>Current Enquiries</h6>
                        <div className="caterer-messages-container">
                            {enquiries.map(enquiry => (
                                <div 
                                    key={enquiry._id} 
                                    className={`enquiry-row ${selectedEnquiryId === enquiry._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedEnquiryId(enquiry._id)}
                                >
                                    <div className="caterer-message">
                                        <strong>Customer:</strong>
                                        <p>{enquiry.message}</p>
                                    </div>
                                    {enquiry.responses && (
                                        <div className="caterer-response">
                                            <strong>You:</strong>
                                            <p>{enquiry.responses}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="caterer-input-container">
                            <input
                                type="text"
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Type your response"
                                className="input-field"
                            />
                            <button onClick={handleSendResponse} className="send-button">
                                Send Response
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWindow;
