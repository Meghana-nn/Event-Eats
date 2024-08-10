import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Label, Input, FormGroup, Form, Button } from 'reactstrap';

const initialState = {
  caterers: [],
  newCaterer: {
    name: '',
    mobile: '',
    location: '',
    categories: [],
    cuisines: [],
    isVeg: false,
    isVerified: false,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CATERERS':
      return { ...state, caterers: action.payload };
    case 'SET_NEW_CATERER':
      return { ...state, newCaterer: { ...state.newCaterer, ...action.payload } };
    case 'RESET_NEW_CATERER':
      return {
        ...state,
        newCaterer: initialState.newCaterer,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

function CatererForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams();  // Get userId from URL

  // Use userId from URL or fallback to localStorage
  const userId = paramUserId || localStorage.getItem('userId');

  const storedCatererId = sessionStorage.getItem('catererId');
  const catererId = storedCatererId;  // Assuming catererId comes from session storage

  useEffect(() => {
    if (userId) {
      // Store userId in localStorage if not already stored
      localStorage.setItem('userId', userId);
      checkUserCaterer(userId);
    }
  }, [userId]);

  const checkUserCaterer = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3010/api/caterers/${userId}`, {
        headers: { Authorization: token },
      });

      const { caterer } = response.data;
      if (caterer) {
        // If the user already has a caterer, set the caterer data
        dispatch({ type: 'SET_NEW_CATERER', payload: caterer });
        sessionStorage.setItem('catererId', caterer._id);
      } else {
        // If no caterer exists, allow the user to create a new one
        fetchCaterers();
      }
    } catch (error) {
      console.error('Error fetching user caterer:', error.message);
    }
  };

  const fetchCaterers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3010/api/caterers', {
        headers: { Authorization: token },
      });
      dispatch({ type: 'SET_CATERERS', payload: response.data });
    } catch (error) {
      console.error('Error fetching caterers:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'categories' || name === 'cuisines') {
      const arrayValue = value.split(',').map((item) => item.trim()).filter((item) => item);
      dispatch({ type: 'SET_NEW_CATERER', payload: { [name]: arrayValue } });
    } else {
      dispatch({ type: 'SET_NEW_CATERER', payload: { [name]: value } });
    }
  };

  const validateForm = () => {
    const { name, mobile, location, categories, cuisines } = state.newCaterer;
    return name && mobile && location && categories.length && cuisines.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...state.newCaterer,
        userId,  // Use userId from localStorage or URL
      };

      let response;
      if (!catererId) {
        response = await axios.post('http://localhost:3010/api/caterers', payload, {
          headers: { Authorization: token },
        });
      }

      if (response && response.data) {
        alert('Caterer saved successfully!');
        dispatch({ type: 'RESET_NEW_CATERER' });

        const caterer = response.data;
        sessionStorage.setItem('catererId', caterer._id);

        if (caterer.isVerified) {
          navigate('service');
        } else {
          navigate('waiting', { state: { catererId: caterer._id } });
        }
      } else {
        console.error('No caterer data returned in response');
        alert('Error: No caterer data returned');
      }
    } catch (error) {
      console.error('Error saving caterer:', error.message);
      alert('An error occurred while saving the caterer. Please try again.');
    }
  };

  return (
    <>
      <div className='background-img'></div>
      <Form className="tableForm" onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="form-group">
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter name"
              type="text"
              value={state.newCaterer.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              placeholder="Enter mobile number"
              type="tel"
              value={state.newCaterer.mobile}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </div>
        <div className="form-group">
          <FormGroup>
            <Label for="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Enter valid address"
              type="text"
              value={state.newCaterer.location}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="categories">Categories</Label>
            <Input
              id="categories"
              name="categories"
              placeholder="Enter the food categories"
              type="text"
              value={state.newCaterer.categories.join(', ')}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </div>
        <div className="form-group">
          <FormGroup>
            <Label for="cuisines">Cuisines</Label>
            <Input
              id="cuisines"
              name="cuisines"
              placeholder="Enter cuisines"
              type="text"
              value={state.newCaterer.cuisines.join(', ')}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </div>
        <div className="form-group">
          <FormGroup>
            <Label for="isVeg">Vegetarian</Label>
            <Input
              id="isVeg"
              name="isVeg"
              type="select"
              value={state.newCaterer.isVeg}
              onChange={handleChange}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Input>
          </FormGroup>
        </div>
        <div className="form-row">
          <Button color="primary" type="submit">Submit</Button>
        </div>
      </Form>
    </>
  );
}

export default CatererForm;
