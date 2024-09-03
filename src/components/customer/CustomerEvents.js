import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { useCustomer } from '../../contexts/CustomerContext';
import moment from 'moment';
import './Customer.css';

const CustomerEvents = () => {
    const { incrementEventCount, setEvent } = useCustomer();
    const location = useLocation();
    const navigate = useNavigate();
    const catererId = location.state?.catererId || null;

    const [event, setEventState] = useState({
        name: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        noOfPeople: '',
        address: {
            building: '',
            locality: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        }
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (catererId) {
            setError('');
        }
    }, [catererId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventState((prevEvent) => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEventState((prevEvent) => ({
            ...prevEvent,
            address: {
                ...prevEvent.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!catererId) {
            setError('Please select a caterer before creating an event.');
            return;
        }

        const formattedEvent = {
            ...event,
            startDate: moment(`${event.startDate} ${event.startTime}`).toISOString(),
            endDate: moment(`${event.endDate} ${event.endTime}`).toISOString()
        };

        try {
            const response = await axios.post(`http://localhost:3010/api/events/${catererId}`, formattedEvent, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            incrementEventCount();
            setEvent(response.data);
            toast.success('Event created successfully! 😺', {
                onClose: () => navigate('/customers/events/fetch', { state: response.data })
            });
        } catch (err) {
            console.error(err);
            setError('Error creating event. Please try again.');
        }
    };

    return (
        <Container className="create-event-container">
            {error && <Alert color="danger">{error}</Alert>}
            <ToastContainer />
            <Form onSubmit={handleSubmit}>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="name">Event Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={event.name}
                                onChange={handleChange}
                                placeholder="Event Name"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="startDate">Start Date</Label>
                            <Input
                                type="date"
                                name="startDate"
                                id="startDate"
                                value={event.startDate}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="startTime">Start Time</Label>
                            <Input
                                type="time"
                                name="startTime"
                                id="startTime"
                                value={event.startTime}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="endDate">End Date</Label>
                            <Input
                                type="date"
                                name="endDate"
                                id="endDate"
                                value={event.endDate}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="endTime">End Time</Label>
                            <Input
                                type="time"
                                name="endTime"
                                id="endTime"
                                value={event.endTime}
                                onChange={handleChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="noOfPeople">Number of People</Label>
                            <Input
                                type="number"
                                name="noOfPeople"
                                id="noOfPeople"
                                value={event.noOfPeople}
                                onChange={handleChange}
                                placeholder="Number of People"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="building">Building</Label>
                            <Input
                                type="text"
                                name="building"
                                id="building"
                                value={event.address.building}
                                onChange={handleAddressChange}
                                placeholder="Building"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="locality">Locality</Label>
                            <Input
                                type="text"
                                name="locality"
                                id="locality"
                                value={event.address.locality}
                                onChange={handleAddressChange}
                                placeholder="Locality"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="city">City</Label>
                            <Input
                                type="text"
                                name="city"
                                id="city"
                                value={event.address.city}
                                onChange={handleAddressChange}
                                placeholder="City"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="state">State</Label>
                            <Input
                                type="text"
                                name="state"
                                id="state"
                                value={event.address.state}
                                onChange={handleAddressChange}
                                placeholder="State"
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="pincode">Pincode</Label>
                            <Input
                                type="text"
                                name="pincode"
                                id="pincode"
                                value={event.address.pincode}
                                onChange={handleAddressChange}
                                placeholder="Pincode"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="country">Country</Label>
                            <Input
                                type="text"
                                name="country"
                                id="country"
                                value={event.address.country}
                                onChange={handleAddressChange}
                                placeholder="Country"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Button type="submit" color="primary">Create Event</Button>
            </Form>
        </Container>
    );
};

export default CustomerEvents;
