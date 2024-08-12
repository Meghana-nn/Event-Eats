import React, { useState } from 'react';
import axios from 'axios';
import { Form,  Label, Input, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; // Import the CSS file

function CatererMenu() {
  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    description: '',
    itemImage: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setMenuItem({ ...menuItem, itemImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log('Form submitted');

    const formData = new FormData();
    formData.append('name', menuItem.name);
    formData.append('price', menuItem.price);
    formData.append('description', menuItem.description);
    formData.append('itemImage', menuItem.itemImage);


    const catererId = localStorage.getItem('catererId');
    console.log('Caterer ID:', catererId);
    formData.append('catererId', catererId);

    try {
      const response = await axios.post('http://localhost:3010/api/menuItem/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      setSuccess('Menu item created successfully!');
      console.log('Menu item created:', response.data);

      if (response.data.catererId) {
        navigate(`list-menu`, {
          state: { caterer: response.data.caterer, service: response.data.service },
        });
      }
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
      {/* Ensure only one Form component */}
      <Form onSubmit={handleSubmit}>
        <div className="menu-form-group">
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" value={menuItem.name} onChange={handleChange} />
        
          <Label for="price">Price</Label>
          <Input type="text" name="price" id="price" value={menuItem.price} onChange={handleChange} />
       
          <Label for="description">Description</Label>
          <Input type="text" name="description" id="description" value={menuItem.description} onChange={handleChange} />
        
          <Label for="itemImage">Upload Image</Label>
          <Input type="file" name="itemImage" id="itemImage" onChange={handleFileChange} />
        </div>
        <Button type="submit" className="button">Add Menu Item</Button>
      </Form>
    </div>
    </div>
  );
}

export default CatererMenu;
