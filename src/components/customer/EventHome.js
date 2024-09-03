import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../contexts/CustomerContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import '../customer/Customer.css';

function EventHome() {
  const { event, setEvent, customerId, fetchEvents, currentEventId, setCurrentEventId } = useCustomer(); // Get currentEventId from context
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleModal = (event = {}) => {
    setEditedEvent(event);
    setModal(!modal);
  };

  const toggleConfirmModal = (event = {}) => {
    setEditedEvent(event);
    setConfirmModal(!confirmModal);
  };

  const fetchEvent = async () => {
    if (currentEventId) {
      try {
        const response = await axios.get(`http://localhost:3010/api/events/${currentEventId}`);
        console.log('Fetched event response:', response.data);
        setEditedEvent(response.data); // Set the specific event data
        setLoading(false);
      } catch (error) {
        setError('Error fetching event data');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [currentEventId]); // Re-fetch the event if currentEventId changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prevState => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3010/api/events/${editedEvent._id}`, editedEvent);
      await fetchEvents(customerId);
      toggleModal();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/api/events/${id}`);
      await fetchEvents(customerId);
      navigate('/customers/events'); // Redirect after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleConfirmLocation = () => {
    navigate('/customers/events/fetch', { state: { event: editedEvent } });
  };

  const formatDateTime = (dateString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Event Details</h2>
      <div className="event-cards-container">
        <Card key={editedEvent._id} className="mb-3">
          <CardBody>
            <CardTitle tag="h5">{editedEvent.name || 'N/A'}</CardTitle>
            <CardText>Start Date: {editedEvent.startDate ? formatDateTime(editedEvent.startDate) : 'N/A'}</CardText>
            <CardText>End Date: {editedEvent.endDate ? formatDateTime(editedEvent.endDate) : 'N/A'}</CardText>
            <CardText>Number of People: {editedEvent.noOfPeople || 'N/A'}</CardText>
            <CardText>Location: {editedEvent.address?.building || 'N/A'}, {editedEvent.address?.locality || 'N/A'}, {editedEvent.address?.city || 'N/A'}</CardText>
            <Button color="secondary" onClick={() => toggleModal(editedEvent)} className="me-2">Edit</Button>
            <Button color="primary" onClick={() => toggleConfirmModal(editedEvent)} className="me-2">Confirm</Button>
            <Button color="danger" onClick={() => handleDelete(editedEvent._id)}>Delete</Button>
          </CardBody>
        </Card>
      </div>

      {/* Edit Event Modal */}
      <Modal isOpen={modal} toggle={() => toggleModal({})}>
        <ModalHeader toggle={() => toggleModal({})}>Edit Event Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Event Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={editedEvent.name || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <Input
                type="datetime-local"
                name="startDate"
                id="startDate"
                value={editedEvent.startDate || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <Input
                type="datetime-local"
                name="endDate"
                id="endDate"
                value={editedEvent.endDate || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="noOfPeople">Number of People</Label>
              <Input
                type="number"
                name="noOfPeople"
                id="noOfPeople"
                value={editedEvent.noOfPeople || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="building">Building</Label>
              <Input
                type="text"
                name="building"
                id="building"
                value={editedEvent.address?.building || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="locality">Locality</Label>
              <Input
                type="text"
                name="locality"
                id="locality"
                value={editedEvent.address?.locality || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={editedEvent.address?.city || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="state">State</Label>
              <Input
                type="text"
                name="state"
                id="state"
                value={editedEvent.address?.state || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="pincode">Pincode</Label>
              <Input
                type="text"
                name="pincode"
                id="pincode"
                value={editedEvent.address?.pincode || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="country">Country</Label>
              <Input
                type="text"
                name="country"
                id="country"
                value={editedEvent.address?.country || ''}
                onChange={handleAddressChange}
              />
            </FormGroup>
            <Button type="submit" color="primary">Save Changes</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Confirm Information Modal */}
      <Modal isOpen={confirmModal} toggle={() => toggleConfirmModal({})}>
        <ModalHeader toggle={() => toggleConfirmModal({})}>Confirm Your Information</ModalHeader>
        <ModalBody>
          <p>Please confirm your information before proceeding 😺!!!</p>
        </ModalBody>
        <Button color="primary" onClick={handleConfirmLocation}>Proceed</Button>
        <Button color="secondary" onClick={() => toggleConfirmModal({})}>Cancel</Button>
      </Modal>
    </div>
  );
}

export default EventHome;
