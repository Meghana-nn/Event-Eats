import React, { useEffect } from 'react';
import axios from 'axios';
import EventMap from '../EventMap'; // Ensure this component exists and works as expected
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../../contexts/CustomerContext';
import { Button } from 'reactstrap';

const CustomerEventList = () => {
    const { customerId, event, setEvent } = useCustomer();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the selected event from location state
    const selectedEvent = location.state?.selectedEvent;

    useEffect(() => {
        fetchEvents();
    }, [customerId]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:3010/api/events/customer/${customerId}`);
            setEvent(response.data); // Update context with fetched events
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleNavigateToCart = (event) => {
        navigate('/cart', { state: { selectedEvent: event } });
    };
    const eventList = Array.isArray(event) ? event : [];
    return (
        <div>
            <h6>Event List</h6>
            <ul>
                {eventList.map(e => {
                    const [longitude, latitude] = e.geoLocation.coordinates || [];

                    return (
                        <li key={e._id}>
                            <strong>{e.name}</strong> - {new Date(e.startDate).toLocaleString()} to {new Date(e.endDate).toLocaleString()} - {e.noOfPeople} people
                            <br />
                            <em>Location:</em> {e.address.building}, {e.address.locality}, {e.address.city}, {e.address.state}, {e.address.pincode}, {e.address.country}
                            
                            {latitude && longitude && (
                                <EventMap coordinates={[latitude, longitude]} />
                            )}
                            <Button color="primary" className="ml-2 mt-2" onClick={() => handleNavigateToCart(e)}>
                                Go to Cart
                            </Button>
                        </li>
                    );
                })}
            </ul>
            
            {/* Display selected event map if available */}
            {/* {selectedEvent && (
                <div>
                    <h6>Selected Event Location</h6>
                    <EventMap coordinates={selectedEvent.geoLocation.coordinates} />
                </div>
            )} */}

            {/* <div className="d-flex justify-content-end align-items-center mt-3">
                <span>Your address has been updated! 😊 Please proceed to payment</span>
                <Button color="primary" className="ml-2" onClick={() => handleNavigateToCart(selectedEvent)}>
                    Go to Cart
                </Button>
            </div> */}
        </div>
    );
};

export default CustomerEventList;
