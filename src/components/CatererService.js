import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button, Col, Row } from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/service.css';

const initialState = {
  serviceName: '',
  description: '',
  price: '',
  duration: '',
  vegetarian: 'yes',
  currentServiceId: null, // Add this to manage update operations
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
    case 'SET_SERVICE_ID':
      return { ...state, currentServiceId: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const CatererService = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const catererId = location.state?.catererId || localStorage.getItem('catererId');
  
  console.log('Caterer ID:', catererId);

  useEffect(() => {
    // Fetch services from local storage if available
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      dispatch({ type: 'SET_SERVICES', payload: JSON.parse(storedServices) });
    }

    // Fetch services from the server if catererId is present
    if (catererId) {
      fetchServices(catererId);
    }
  }, [catererId]);

  const fetchServices = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3010/api/services/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: 'SET_SERVICES', payload: response.data });
      localStorage.setItem('services', JSON.stringify(response.data));
    } catch (err) {
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
        vegetarian: state.vegetarian,
        catererId, // Add catererId to the payload
      };

      let response;
      if (!state.currentServiceId) {
        // Creating a new service
        response = await axios.post('http://localhost:3010/api/services', payload, {
          headers: { Authorization: token },
        });
      } else {
        // Updating an existing service
        response = await axios.put(`http://localhost:3010/api/services/${state.currentServiceId}`, payload, {
          headers: { Authorization: token },
        });
      }

      console.log('Service response:', response);

      // Update the services list
      let updatedServices;
      if (state.currentServiceId) {
        updatedServices = state.services.map(service =>
          service._id === state.currentServiceId ? response.data.service : service
        );
      } else {
        updatedServices = [...state.services, response.data.service];
      }

      // Store the updated services in local storage
      localStorage.setItem('services', JSON.stringify(updatedServices));
      dispatch({ type: 'SET_SERVICES', payload: updatedServices });

      // Store caterer ID and service response in session storage
      sessionStorage.setItem('catererId', catererId);
      sessionStorage.setItem('serviceResponse', JSON.stringify(response.data));

      // Navigate to the caterer details page
      if (catererId) {
        navigate(`/caterer/details`, {
          state: { caterer: response.data.caterer, service: response.data.service },
        });
      } else {
        console.log('Caterer ID is missing in response');
      }

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
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
                value={state.serviceName}
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
                value={state.duration}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="price">Price ($):</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={state.price}
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
                value={state.vegetarian}
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
          <Col md={12}>
            <FormGroup>
              <Label for="description">Description:</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={state.description}
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
