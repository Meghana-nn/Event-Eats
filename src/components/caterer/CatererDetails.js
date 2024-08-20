import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { useCaterer } from '../../contexts/CatererContext'; // Adjust the path as necessary
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Table } from 'reactstrap';
import '../../components/caterer/service.css';

const initialState = {
  caterer: null,
  services: [],
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CATERER':
      return { ...state, caterer: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CatererDetails = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { catererId, resetCaterer } = useCaterer(); // Use CatererContext
  const [catererModal, setCatererModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [editCaterer, setEditCaterer] = useState(null);
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    if (catererId) {
      fetchCatererDetails(catererId);
    }
  }, [catererId]);

  const fetchCatererDetails = async (catererId) => {
    try {
      const response = await axios.get(`http://localhost:3010/api/caterers/${catererId}`);
      const caterer = response.data;
      dispatch({ type: 'SET_CATERER', payload: caterer });


      const token = localStorage.getItem('token');
      const servicesResponse = await axios.get(`http://localhost:3010/api/services/caterer/${catererId}`,{
        headers: { Authorization: token },
    });
      
      const services = servicesResponse.data;
      console.log(services,':service')
      dispatch({ type: 'SET_SERVICES', payload: services });
      localStorage.setItem('services', JSON.stringify(services));

    } catch (err) {
      console.error('Error fetching caterer details:', err.message);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const toggleCatererModal = () => setCatererModal(!catererModal);
  const toggleServiceModal = () => setServiceModal(!serviceModal);

  const handleEditCaterer = () => {
    setEditCaterer(state.caterer);
    toggleCatererModal();
  };

  const handleCatererChange = (e) => {
    setEditCaterer({ ...editCaterer, [e.target.name]: e.target.value });
  };

  const handleSaveCaterer = async () => {
    try {
      const response = await axios.put(`http://localhost:3010/api/caterers/${editCaterer._id}`, editCaterer);
      console.log('Updated caterer:', response.data);
      fetchCatererDetails(catererId);
      toggleCatererModal();
    } catch (err) {
      console.error('Error updating caterer:', err.message);
    }
  };

  const handleDeleteCaterer = async () => {
    try {
      await axios.delete(`http://localhost:3010/api/caterers/${state.caterer._id}`);
      console.log('Caterer deleted:', state.caterer._id);
      resetCaterer(); // Reset the caterer context after deletion
    } catch (err) {
      console.error('Error deleting caterer:', err.message);
    }
  };

  const handleEditService = (service) => {
    setEditService(service);
    toggleServiceModal();
  };

  const handleServiceChange = (e) => {
    setEditService({ ...editService, [e.target.name]: e.target.value });
  };

  const handleSaveService = async () => {
    try {
      const response = await axios.put(`http://localhost:3010/api/services/${editService._id}`, editService);
      console.log('Updated service:', response.data);
      fetchCatererDetails(catererId);
      toggleServiceModal();
    } catch (err) {
      console.error('Error updating service:', err.message);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:3010/api/services/${serviceId}`);
      console.log('Service deleted:', serviceId);
      fetchCatererDetails(catererId);
    } catch (err) {
      console.error('Error deleting service:', err.message);
    }
  };

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  if (!state.caterer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="details-container">
      <h6>Caterer Details</h6>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            
            <th>Location</th>
            <th>Mobile</th>
            <th>Categories</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            
            <td>{state.caterer.name}</td>
           <td>{state.caterer.location}</td>
            <td>{state.caterer.mobile}</td>
            <td>{state.caterer.categories}</td>
            <td>{state.caterer.isVerified ? 'Yes' : 'No'}</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              <Button color="primary" onClick={handleEditCaterer} style={{ marginRight: '5px' }}>
                Edit
              </Button>
              <Button color="danger" onClick={handleDeleteCaterer}>
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <h6>Services</h6>
      <Table striped>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Category</th>
            <th>Vegetarian</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.services.map((service) => (
            <tr key={service._id}>
              <td>{service.serviceName}</td>
              <td>{service.description}</td>
              <td>{service.price}</td>
              <td>{service.duration}</td>
              <td>{service.category}</td>
              <td>{service.vegetarian ? 'Yes' : 'No'}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <Button color="primary" onClick={() => handleEditService(service)} style={{ marginRight: '5px' }}>
                  Edit
                </Button>
                <Button color="danger" onClick={() => handleDeleteService(service._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Caterer Edit Modal */}
      <Modal isOpen={catererModal} toggle={toggleCatererModal}>
        <ModalHeader toggle={toggleCatererModal}>Edit Caterer</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Caterer Name</Label>
              <Input type="text" name="name" id="name" value={editCaterer?.name || ''} onChange={handleCatererChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                value={editCaterer?.description || ''}
                onChange={handleCatererChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="location">Location</Label>
              <Input type="text" name="location" id="location" value={editCaterer?.location || ''} onChange={handleCatererChange} />
            </FormGroup>
            <FormGroup>
              <Label for="mobile">Mobile</Label>
              <Input type="text" name="mobile" id="mobile" value={editCaterer?.mobile || ''} onChange={handleCatererChange} />
            </FormGroup>
            <FormGroup>
              <Label for="categories">Categories</Label>
              <Input
                type="text"
                name="categories"
                id="categories"
                value={editCaterer?.categories || ''}
                onChange={handleCatererChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="isVerified">Verified</Label>
              <Input
                type="select"
                name="isVerified"
                id="isVerified"
                value={editCaterer?.isVerified || ''}
                onChange={handleCatererChange}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveCaterer}>
            Save
          </Button>{' '}
          <Button color="secondary" onClick={toggleCatererModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Service Edit Modal */}
      <Modal isOpen={serviceModal} toggle={toggleServiceModal}>
        <ModalHeader toggle={toggleServiceModal}>Edit Service</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="serviceName">Service Name</Label>
              <Input
                type="text"
                name="serviceName"
                id="serviceName"
                value={editService?.serviceName || ''}
                onChange={handleServiceChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                value={editService?.description || ''}
                onChange={handleServiceChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={editService?.price || ''}
                onChange={handleServiceChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <Input
                type="text"
                name="duration"
                id="duration"
                value={editService?.duration || ''}
                onChange={handleServiceChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categories">Categories</Label>
              <Input
                type="text"
                name="categories"
                id="categories"
                value={editService?.categories || ''}
                onChange={handleServiceChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="vegetarian">Vegetarian</Label>
              <Input
                type="select"
                name="vegetarian"
                id="vegetarian"
                value={editService?.vegetarian || ''}
                onChange={handleServiceChange}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveService}>
            Save
          </Button>{' '}
          <Button color="secondary" onClick={toggleServiceModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CatererDetails;
