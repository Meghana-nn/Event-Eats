import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ListGroup, ListGroupItem, Button, Alert } from 'reactstrap';

function ListMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/menuItem', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setMenuItems(response.data);
      } catch (error) {
        setError('Failed to fetch menu items.');
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/api/menuItem/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setSuccess('Menu item deleted successfully!');
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error) {
      setError('Failed to delete menu item.');
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div>
      <h2>Menu Items</h2>
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <ListGroup>
        {menuItems.map((item) => (
          <ListGroupItem key={item._id}>
            <div>
              <h5>{item.name}</h5>
              <p>Price: {item.price}</p>
              <p>Description: {item.description}</p>
              <Button color="danger" onClick={() => handleDelete(item._id)}>
                Delete
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

export default ListMenu;
