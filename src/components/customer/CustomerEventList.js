import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';

const CustomerEventList = ({ customerId }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, [customerId]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:3010/api/events/customer/${customerId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    return (
        <div>
                
            <h6>Event List</h6>
            <ul>
                {events.map(event => (
                    <li key={event._id}>
                        <strong>{event.name}</strong> - {new Date(event.startDate).toLocaleString()} to {new Date(event.endDate).toLocaleString()} - {event.noOfPeople} people
                        <br />
                        <em>Location:</em> {event.address.building}, {event.address.locality}, {event.address.city}, {event.address.state}, {event.address.pincode}, {event.address.country}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerEventList;
