import React, { useState,useEffect,useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function WaitingPage() {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { catererId } = location.state || {};

  const checkVerificationStatus = useCallback(async ()=> {
    const token=localStorage.getItem('token')
    if (!catererId || !token) {
      console.error('Missing catererId or token.');
      return;
    }
    console.log(token)
    console.log(catererId)
    try {
      const response = await axios.get(`http://localhost:3010/api/caterers/status/${catererId}`,{
        headers:{
          Authorization:token
        }
      });
      if (response.data.isVerified) {
        navigate('service');
        alert('please fill your service from')
      } 
    } catch (error) {
      console.error('Error checking verification status:', error.message);
    }
  },[catererId,navigate])

  useEffect(() => {
    if (catererId) {
      localStorage.setItem('catererId', catererId);
      const intervalId = setInterval(() => {
        checkVerificationStatus();
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId);
    } else {
      alert('Please fill your information properly.');
      navigate('form');
    }
  }, [catererId, checkVerificationStatus, navigate]);

  return (
    <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Processing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your information is being processed. Please wait.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default WaitingPage;
