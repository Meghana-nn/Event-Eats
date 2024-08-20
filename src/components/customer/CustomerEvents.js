import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Row, Col, Form, FormGroup, Input, Button } from 'reactstrap';
import { useCaterer } from '../../contexts/CatererContext'; // Import useCaterer hook
import '../customer/Customer.css';

const CustomerEvents = () => {
    const { catererId } = useCaterer(); // Access catererId using the useCaterer hook
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        noOfPeople: '',
        address: {
            building: '',
            locality: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        },
        amount: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...formData, catererId }; // Include catererId in the form data
            await axios.post(`http://localhost:3010/api/events/${catererId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }, dataToSubmit);
            navigate('/events/fetch');
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };


    return (
        <div className="customer-events-box">
             
            <Form onSubmit={handleSubmit} className="customer-events-form">
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Event Name"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Input
                                type="number"
                                name="noOfPeople"
                                value={formData.noOfPeople}
                                onChange={handleChange}
                                placeholder="Number of People"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.building"
                                value={formData.address.building}
                                onChange={handleChange}
                                placeholder="Building"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="12">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.locality"
                                value={formData.address.locality}
                                onChange={handleChange}
                                placeholder="Locality"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.state"
                                value={formData.address.state}
                                onChange={handleChange}
                                placeholder="State"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.pincode"
                                value={formData.address.pincode}
                                onChange={handleChange}
                                placeholder="Pincode"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs="6">
                        <FormGroup>
                            <Input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleChange}
                                placeholder="Country"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Amount"
                                required
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Button type="submit" className="submit-button">Create Event</Button>
            </Form>
        </div>
    );
};

export default CustomerEvents;
