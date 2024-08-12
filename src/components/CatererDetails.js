import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import { useCaterer } from '../contexts/CatererContext'; // Import useCaterer hook
import '../components/Caterer.css';

function CatererDetails() {
  const location = useLocation();
  const { state } = location;

  const { catererData, setCatererData, catererId, setCatererId, resetCaterer } = useCaterer(); // Use context hook

  const [modal, setModal] = useState(false);
  const [editCaterer, setEditCaterer] = useState(catererData || {});
  const [editService, setEditService] = useState(catererData?.service || {});
  const [editSection, setEditSection] = useState('caterer');

  useEffect(() => {
    if (!catererData && catererId) {
      const fetchCatererData = async () => {
        try {
          const response = await axios.get(`http://localhost:3010/api/caterers/${catererId}`);
          const fetchedCaterer = response.data;
          if (fetchedCaterer) {
            setCatererData(fetchedCaterer);
          }
        } catch (error) {
          console.error('Error fetching caterer data:', error);
        }
      };
      fetchCatererData();
    }
  }, [catererId, catererData, setCatererData]);

  useEffect(() => {
    if (state) {
      setCatererData(state.caterer);
      setEditService(state.caterer?.service || {});
    }
  }, [state, setCatererData]);

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCaterer(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setEditService(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (editSection === 'caterer') {
        await axios.put(`/api/caterers/${editCaterer._id}`, editCaterer);
        setCatererData(editCaterer);
      } else {
        await axios.put(`/api/services/${editService._id}`, editService);
        setEditService(editService);
        setCatererData(prev => ({ ...prev, service: editService }));
      }
      toggleModal();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleEditCaterer = () => {
    setEditSection('caterer');
    setEditCaterer(catererData || {});
    toggleModal();
  };

  const handleEditService = () => {
    setEditSection('service');
    setEditService(catererData?.service || {});
    toggleModal();
  };

  return (
    <Container className="details-container">
      <Row>
        <Col md="6">
          <h6>Caterer Details</h6>
          {catererData ? (
            <Table striped dark>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{catererData.name || 'No Name Available'}</td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td>{catererData.location || 'No Location Available'}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{catererData.mobile || 'No Mobile Available'}</td>
                </tr>
                <tr>
                  <th>Categories</th>
                  <td>{catererData.categories ? catererData.categories.join(', ') : 'No Categories Available'}</td>
                </tr>
                <tr>
                  <th>Cuisines</th>
                  <td>{catererData.cuisines ? catererData.cuisines.join(', ') : 'No Cuisines Available'}</td>
                </tr>
                <tr>
                  <th>Vegetarian</th>
                  <td>{catererData.isVeg ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th>Verified</th>
                  <td>{catererData.isVerified ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <Button color="primary" onClick={handleEditCaterer}>Edit Caterer</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p>No caterer details available.</p>
          )}
        </Col>
        <Col md="6">
          <h6>Service Details</h6>
          {editService ? (
            <Table striped dark>
              <tbody>
                <tr>
                  <th>Service Name</th>
                  <td>{editService.serviceName || 'No Name Available'}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{editService.description || 'No Description Available'}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>{editService.price || 'No Price Available'}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <Button color="primary" onClick={handleEditService}>Edit Service</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p>No service details available for this caterer.</p>
          )}
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit {editSection === 'caterer' ? 'Caterer' : 'Service'} Details</ModalHeader>
        <ModalBody>
          <Form>
            {editSection === 'caterer' ? (
              <>
                <h4>Caterer Details</h4>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={editCaterer.name || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="location">Location</Label>
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    value={editCaterer.location || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="mobile">Mobile</Label>
                  <Input
                    type="text"
                    name="mobile"
                    id="mobile"
                    value={editCaterer.mobile || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="categories">Categories</Label>
                  <Input
                    type="text"
                    name="categories"
                    id="categories"
                    value={editCaterer.categories ? editCaterer.categories.join(', ') : ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="cuisines">Cuisines</Label>
                  <Input
                    type="text"
                    name="cuisines"
                    id="cuisines"
                    value={editCaterer.cuisines ? editCaterer.cuisines.join(', ') : ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="isVeg">Vegetarian</Label>
                  <Input
                    type="checkbox"
                    name="isVeg"
                    id="isVeg"
                    checked={editCaterer.isVeg || false}
                    onChange={e => setEditCaterer(prev => ({ ...prev, isVeg: e.target.checked }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="isVerified">Verified</Label>
                  <Input
                    type="checkbox"
                    name="isVerified"
                    id="isVerified"
                    checked={editCaterer.isVerified || false}
                    onChange={e => setEditCaterer(prev => ({ ...prev, isVerified: e.target.checked }))}
                  />
                </FormGroup>
              </>
            ) : (
              <>
                <h4>Service Details</h4>
                <FormGroup>
                  <Label for="serviceName">Service Name</Label>
                  <Input
                    type="text"
                    name="serviceName"
                    id="serviceName"
                    value={editService.serviceName || ''}
                    onChange={handleServiceChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={editService.description || ''}
                    onChange={handleServiceChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    value={editService.price || ''}
                    onChange={handleServiceChange}
                  />
                </FormGroup>
              </>
            )}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>Save</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default CatererDetails;
