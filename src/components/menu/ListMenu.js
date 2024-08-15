import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'; // Ensure only one import
import { Button, Alert, Col, Row } from 'reactstrap'; // Check this if you're using reactstrap or bootstrap
import { useCaterer } from '../../contexts/CatererContext'; // Adjust path as necessary

function ListMenu() {
  const { catererId } = useCaterer(); // Use context to get catererId
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (catererId) {
      const fetchMenuItems = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`http://localhost:3010/api/menuItem/caterer/${catererId}`, {
            headers: {
              Authorization: token,
            },
          });
          setMenuItems(response.data);
          console.log('Menu items fetched:', response.data);
        } catch (error) {
          setError('Failed to fetch menu items.');
          console.error('Error fetching menu items:', error);
        }
      };

      fetchMenuItems();
    }
  }, [catererId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/api/menuItems/${id}`);
      setSuccess('Menu item deleted successfully!');
      setMenuItems(menuItems.filter((item) => item._id !== id));
    } catch (error) {
      setError('Failed to delete menu item.');
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div>
      <h3>Menu Items</h3>
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <Row>
        {menuItems.map((item) => (
          <Col md="2" key={item._id} className="mb-4">
            <Card style={{ width: '12rem' }}>
              {item.menuImages && item.menuImages.length > 0 && (
                <Card.Img
                  variant="top"
                  src={item.menuImages} // Use the first image URL
                  alt={item.name}
                  style={{ height: '8rem', objectFit: 'cover',width:'100% '}}
                />
              )}
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Item Type: {item.itemType.join(', ')}</Card.Text>
                <Button variant="danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </Card.Body>
              <ListGroup className="list-group-flush">
                {item.menuImages.slice(1).map((imgUrl, index) => (
                  <ListGroup.Item key={index}>
                    <img src={imgUrl} alt={`image-${index}`} style={{ maxWidth: '80px',height:'auto' }} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ListMenu;
