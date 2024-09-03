import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCaterer } from '../../contexts/CatererContext'; // Adjust the path as necessary
import '../../components/caterer/service.css';

const initialState = {
  serviceName: '',
  description: '',
  price: '',
  duration: '',
  vegetarian: 'yes',
  category: '', // Ensure category is initialized
  currentServiceId: null,
  services: [],
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CatererService = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, setServiceId, catererId } = useCaterer(); // Use CatererContext

  useEffect(() => {
    const currentServiceId = location.state?.serviceId || serviceId || sessionStorage.getItem('serviceId');
    console.log('Service ID from location or context:', currentServiceId);

    if (currentServiceId) {
      fetchServiceById(currentServiceId);
    }
  }, [serviceId, location.state?.serviceId]); // Include location.state?.serviceId

  const fetchServiceById = async (serviceId) => {
    try {
      if (!serviceId) {
        throw new Error('Service ID is missing');
      }
  
      console.log('Fetching service with ID:', serviceId);
  
      // Direct GET request to the backend
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3010/api/services`, {
        headers: {
          Authorization: `Bearer ${token}` // Add 'Bearer ' to token if needed
        }
      });
  
      console.log('Server Response:', response.data);
  
      // Since response is an array, find the service with the matching ID
      const fetchedService = response.data.find(service => service._id === serviceId);
      console.log('Fetched service data:', fetchedService);

      if (fetchedService) {
        dispatch({ type: 'SET_SERVICES', payload: [fetchedService] });
        localStorage.setItem('services', JSON.stringify([fetchedService]));
      } else {
        console.error('Service not found in the returned array');
        throw new Error('Service not found');
      }
    } catch (err) {
      console.error('Error fetching service:', err.message);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  const handleChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        serviceName: state.serviceName,
        description: state.description,
        price: state.price,
        duration: state.duration,
        category:state.category,
        vegetarian: state.vegetarian,
        catererId
      };

      let response;
      if (!state.currentServiceId) {
        response = await axios.post('http://localhost:3010/api/services', payload, {
          headers: { Authorization: token }, // Add 'Bearer ' to token if needed
        });
      } else {
        response = await axios.put(`http://localhost:3010/api/services/${state.currentServiceId}`, payload, {
          headers: { Authorization: token }, // Add 'Bearer ' to token if needed
        });
      }

      console.log('Service response:', response);

      const createdServiceId = response.data.service._id;
      setServiceId(createdServiceId); // Store in context
      sessionStorage.setItem('serviceId', createdServiceId);
      console.log('Service ID stored in context and sessionStorage:', createdServiceId);

      dispatch({ type: 'RESET_FORM' });

      // Navigate to CatererDetails page after successful submission
      navigate('/caterer/details', { state: { serviceId: createdServiceId } });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  return (
    <div className="service-tableForm">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="serviceName">Service Name:</Label>
              <Input
                type="text"
                name="serviceName"
                id="serviceName"
                value={state.serviceName || ''} // Ensure default value
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="duration">Duration (hours):</Label>
              <Input
                type="number"
                name="duration"
                id="duration"
                value={state.duration || ''} // Ensure default value
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="price">Price (₹):</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={state.price || ''} // Ensure default value
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="vegetarian">Vegetarian Options:</Label>
              <Input
                type="select"
                name="vegetarian"
                id="vegetarian"
                value={state.vegetarian || ''} // Ensure default value
                onChange={handleChange}
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="category">Category:</Label>
              <Input
                type="text"
                name="category"
                id="category"
                value={state.category || ''} // Ensure default value
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="description">Description:</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={state.description || ''} // Ensure default value
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary">Add Service</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CatererService;
