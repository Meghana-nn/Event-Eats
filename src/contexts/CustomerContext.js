import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CustomerContext = createContext();

export const useCustomer = () => {
  return useContext(CustomerContext);
};

export const CustomerProvider = ({ children }) => {
  const [eventCount, setEventCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [event, setEvent] = useState([]);
  const [eventId, setEventId] = useState(null); // Added state for eventId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCustomerId = async () => {
    try {
      const response = await axios.get('http://localhost:3010/api/users/account', {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      console.log('response customer',response)
      setCustomerId(response.data._id);
    } catch (error) {
      setError('Error fetching customer ID');
      console.error('Error fetching customer ID:', error);
    }
  };

  const fetchEvents = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:3010/api/events/customer/${customerId}`);
      console.log('Fetched events response:', response.data);

      if (Array.isArray(response.data)) {
        setEvent(response.data);
        setEventCount(response.data.length);
        if (response.data.length > 0 && !eventId) {
          setEventId(response.data[0]._id); // Set eventId based on the first event if not already set
        }
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      setError('Error fetching events');
      console.error('Error fetching events:', error);
    }
  };

  const fetchEventById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3010/api/events/${id}`);
      setEvent([response.data]); // Assuming you want to set the single event
      setEventId(response.data._id); // Set eventId directly
    } catch (error) {
      setError('Error fetching event by ID');
      console.error('Error fetching event by ID:', error);
    }
  };

  const updateEventId = (id) => {
    setEventId(id);
    fetchEventById(id); // Optionally fetch the event details when ID changes
  };

  const incrementEventCount = () => {
    setEventCount(eventCount + 1); // Directly increment the count
  };

  useEffect(() => {
    fetchCustomerId(); // Fetch customer ID on component mount
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchEvents(customerId);
    }
  }, [customerId]);

  return (
    <CustomerContext.Provider
      value={{
        eventCount,
        customerId,
        setCustomerId,
        event,
        eventId, 
        setEvent,
        fetchEvents,
        fetchEventById, 
        updateEventId, 
        incrementEventCount, // Provide the increment function
        loading,
        error
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
