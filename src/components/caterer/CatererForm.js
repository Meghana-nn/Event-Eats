import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label, Input, FormGroup, Form, Button } from 'reactstrap';
import { useCaterer } from '../../contexts/CatererContext';
import axios from 'axios';

function CatererForm() {
  const navigate = useNavigate();
  const { userId, setUserId, catererId, setCatererId, setCatererData, resetCaterer } = useCaterer();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    categories: [],
    cuisines: [],
    isVeg: false,
  });
  const [userCatererExists, setUserCatererExists] = useState(false);

  useEffect(() => {
    const initializeCatererData = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }

        const storedCatererId = localStorage.getItem('catererId');
        console.log('Stored catererId from localStorage:', storedCatererId);

        if (storedCatererId) {
          const response = await axios.get(`http://localhost:3010/api/caterers/${storedCatererId}`);
          console.log('API response:', response);

          if (response && response.data) {
            const caterer = response.data;
            console.log('Caterer data retrieved:', caterer);

            setCatererData(caterer);
            setFormData({
              name: caterer.name,
              mobile: caterer.mobile,
              location: caterer.location,
              categories: caterer.categories,
              cuisines: caterer.cuisines,
              isVeg: caterer.isVeg,
            });
            setUserCatererExists(true);
          } else {
            console.log('No data found for this caterer');
            setUserCatererExists(false);
          }
        }
      } catch (error) {
        console.error('Error fetching caterer data:', error);
        setUserCatererExists(false);
      }
    };

    if (catererId) {
      console.log('CatererId exists:', catererId);
      initializeCatererData();
    } else {
      console.log('No CatererId found');
      setUserCatererExists(false);
    }
  }, [catererId, setCatererData, setUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to`, value);

    if (name === 'categories' || name === 'cuisines') {
      const arrayValue = value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item);
      setFormData((prevData) => ({
        ...prevData,
        [name]: arrayValue,
      }));
    } else if (name === 'isVeg') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value === 'true',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const { name, mobile, location, categories, cuisines } = formData;
    console.log('Validating form with data:', formData);
    return name && mobile && location && categories.length && cuisines.length;
  };

  const fetchCatererIdByUserId = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3010/api/caterers/users/${userId}`,{
        headers: { Authorization:token }
      });
      console.log('response',response)
      const caterer = response.data;
      return caterer._id || null;
    } catch (error) {
      console.error('Error fetching caterer by userId:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission attempted with data:', formData);

    if (userCatererExists) {
      alert('You already have a caterer service.');
      return;
    }

    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);

      const payload = {
        ...formData,
        userId,
      };
      console.log('Payload for submission:', payload);

      let response;

      if (!catererId) {
        // Fetch catererId if not already available
        const fetchedCatererId = await fetchCatererIdByUserId(userId);
        if (fetchedCatererId) {
          sessionStorage.setItem('catererId', fetchedCatererId);
          localStorage.setItem('catererId', fetchedCatererId);
          setCatererId(fetchedCatererId);
        }

        // Create new caterer
        response = await axios.post('http://localhost:3010/api/caterers', payload, {
          headers: { Authorization:token },
        });
        console.log('Post response:', response);
      } else {
        // Update existing caterer
        response = await axios.put(`http://localhost:3010/api/caterers/${catererId}`, payload, {
          headers: { Authorization: token },
        });
        console.log('Put response:', response);
      }

      if (response && response.data) {
        alert('Caterer saved successfully!');
        const caterer = response.data;
        console.log('Caterer saved successfully:', caterer);

        setCatererId(caterer._id);

        // Store the unique caterer ID in session storage
        sessionStorage.setItem('catererId', caterer._id);
        localStorage.setItem('catererId', caterer._id);

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
      if (error.response) {
        console.error('Error saving caterer:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Something went wrong!'}`);
      } else if (error.request) {
        console.error('Error saving caterer:', error.request);
        alert('Error: No response received from server. Please try again later.');
      } else {
        console.error('Error saving caterer:', error.message);
        alert('Error: Something went wrong. Please try again.');
      }
    }
  };
  
  return (
    <>
      <div className="background-img"></div>
      {userCatererExists ? (
        <div>
          <h4>You are already a caterer </h4>
          <Button color="primary" onClick={() => navigate('service')}>
            Go to Service
          </Button>
        </div>
      ) : (
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
                value={formData.name}
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
                value={formData.mobile}
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
                value={formData.location}
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
                value={formData.categories.join(', ')}
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
                value={formData.cuisines.join(', ')}
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
                value={formData.isVeg}
                onChange={handleChange}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Input>
            </FormGroup>
          </div>
          <div className="form-row">
            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}

export default CatererForm;
