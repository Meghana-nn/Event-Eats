import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import '../components/Caterer.css';

function CatererDetails() {
  const location = useLocation();
  const { state } = location;

  const [caterer, setCaterer] = useState(state?.caterer || JSON.parse(localStorage.getItem('caterer')));
  const [service, setService] = useState(state?.service || JSON.parse(localStorage.getItem('service')));
  const [modal, setModal] = useState(false);
  const [editCaterer, setEditCaterer] = useState(caterer);
  const [editService, setEditService] = useState(service);
  const [editSection, setEditSection] = useState('caterer');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!caterer && userId) {
      axios
        .get(`/api/caterers/byUserId/${userId}`)
        .then(response => {
          const fetchedCaterer = response.data.caterer;
          const fetchedService = response.data.service; // Assuming service data is also available in the response

          if (fetchedCaterer) {
            setCaterer(fetchedCaterer);
            localStorage.setItem('caterer', JSON.stringify(fetchedCaterer));
          }

          if (fetchedService) {
            setService(fetchedService);
            localStorage.setItem('service', JSON.stringify(fetchedService));
          }
        })
        .catch(error => {
          console.error('Error fetching caterer data:', error);
        });
    }
  }, [caterer]);

  useEffect(() => {
    if (state) {
      localStorage.setItem('caterer', JSON.stringify(state.caterer));
      localStorage.setItem('service', JSON.stringify(state.service));
      setCaterer(state.caterer);
      setService(state.service);
    }
  }, [state]);

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCaterer({ ...editCaterer, [name]: value });
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setEditService({ ...editService, [name]: value });
  };

  const handleSave = () => {
    if (editSection === 'caterer') {
      setCaterer(editCaterer);
      localStorage.setItem('caterer', JSON.stringify(editCaterer));
    } else {
      setService(editService);
      localStorage.setItem('service', JSON.stringify(editService));
    }
    toggleModal();
  };

  const handleEditCaterer = () => {
    setEditSection('caterer');
    setEditCaterer(caterer);
    toggleModal();
  };

  const handleEditService = () => {
    setEditSection('service');
    setEditService(service);
    toggleModal();
  };

  return (
    <Container className="details-container">
      <Row>
        <Col md="6">
          <h6>Caterer Details</h6>
          {caterer ? (
            <Table striped dark>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{caterer.name || 'No Name Available'}</td>
                </tr>
                <tr>
                  <th>Location</th>
                  <td>{caterer.location || 'No Location Available'}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{caterer.mobile || 'No Mobile Available'}</td>
                </tr>
                <tr>
                  <th>Categories</th>
                  <td>{caterer.categories ? caterer.categories.join(', ') : 'No Categories Available'}</td>
                </tr>
                <tr>
                  <th>Cuisines</th>
                  <td>{caterer.cuisines ? caterer.cuisines.join(', ') : 'No Cuisines Available'}</td>
                </tr>
                <tr>
                  <th>Vegetarian</th>
                  <td>{caterer.isVeg ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <th>Verified</th>
                  <td>{caterer.isVerified ? 'Yes' : 'No'}</td>
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
          {service ? (
            <Table striped dark>
              <tbody>
                <tr>
                  <th>Service Name</th>
                  <td>{service.serviceName || 'No Name Available'}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{service.description || 'No Description Available'}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>{service.price || 'No Price Available'}</td>
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
                  <Input type="text" name="name" id="name" value={editCaterer.name || ''} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="location">Location</Label>
                  <Input type="text" name="location" id="location" value={editCaterer.location || ''} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="mobile">Mobile</Label>
                  <Input type="text" name="mobile" id="mobile" value={editCaterer.mobile || ''} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="categories">Categories</Label>
                  <Input type="text" name="categories" id="categories" value={editCaterer.categories ? editCaterer.categories.join(', ') : ''} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="cuisines">Cuisines</Label>
                  <Input type="text" name="cuisines" id="cuisines" value={editCaterer.cuisines ? editCaterer.cuisines.join(', ') : ''} onChange={handleInputChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="isVeg">Vegetarian</Label>
                  <Input type="checkbox" name="isVeg" id="isVeg" checked={editCaterer.isVeg || false} onChange={e => setEditCaterer({ ...editCaterer, isVeg: e.target.checked })} />
                </FormGroup>
                <FormGroup>
                  <Label for="isVerified">Verified</Label>
                  <Input type="checkbox" name="isVerified" id="isVerified" checked={editCaterer.isVerified || false} onChange={e => setEditCaterer({ ...editCaterer, isVerified: e.target.checked })} />
                </FormGroup>
              </>
            ) : (
              <>
                <h4>Service Details</h4>
                <FormGroup>
                  <Label for="serviceName">Service Name</Label>
                  <Input type="text" name="serviceName" id="serviceName" value={editService.serviceName || ''} onChange={handleServiceChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input type="text" name="description" id="description" value={editService.description || ''} onChange={handleServiceChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input type="text" name="price" id="price" value={editService.price || ''} onChange={handleServiceChange} />
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
