import React, { useState } from 'react';
import axios from 'axios';
import { Form, Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useCaterer } from '../../contexts/CatererContext'; // Import the hook from CatererContext
import './Menu.css'; // Import the CSS file



function CatererMenu() {
  const [menuItem, setMenuItem] = useState({
    name: '',
    itemType: '',
    amount:'',
    menuImages: []
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { catererId ,updateMenuItems} = useCaterer(); // Use the context to get catererId
  console.log('updateMenuItems exists:', typeof updateMenuItems === 'function');

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMenuItem({ ...menuItem, menuImages: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log('Form submitted');

    const formData = new FormData();
    formData.append('name', menuItem.name);
    formData.append('itemType', menuItem.itemType);
    formData.append('amount', menuItem.amount);
    formData.append('catererId', catererId); 

    for (let i = 0; i < menuItem.menuImages.length; i++) {
      formData.append('menuImages', menuItem.menuImages[i]);
    }

    console.log('Caterer ID:', catererId); // Ensure the correct catererId is logged

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:3010/api/menuItem/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'Authorization': token
        },
      });
      setSuccess('Menu item created successfully!');
      updateMenuItems()
      console.log('Menu item created:', response.data);

      navigate('list/menu', {
        state: { catererId: catererId },
      });
    } catch (error) {
      setError('Error uploading menu item. Please try again.');
      console.error('Error uploading menu item:', error);
    }
  };

  return (
    <div className='menu-container'>
      <div className='menu-image'>
        <h2>Add New Menu Item</h2>
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <div className="menu-form-group">
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={menuItem.name} onChange={handleChange} />

            <Label for="itemType">Item Type</Label>
            <Input type="text" name="itemType" id="itemType" value={menuItem.itemType} onChange={handleChange} />
            <Label for="amount">Amount</Label>
            <Input type="number" name="amount" id="amount" value={menuItem.amount} onChange={handleChange} />

            <Label for="menuImages">Upload Images</Label>
            <Input type="file" name="menuImages" id="menuImages" multiple onChange={handleFileChange} />
          </div>
          <Button type="submit" className="button">Add Menu Item</Button>
        </Form>
      </div>
    </div>
  );
}

export default CatererMenu;
