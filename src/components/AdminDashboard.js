import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ListGroup, Alert, Spinner } from 'react-bootstrap';

const AdminDashboard = () => {
    const [pendingCaterers, setPendingCaterers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingCaterers = async () => {
            try {
                const response = await axios.post('http://localhost:3010/api/caterers/pending', {}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                setPendingCaterers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching pending caterers');
                setLoading(false);
            }
        };

        fetchPendingCaterers();
    }, []);

    const handleVerify = async (catererId) => {
        try {
            const response = await axios.put(`http://localhost:3010/api/caterers/verify/${catererId}`, {}, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });

            console.log('Verification response:', response.data);

            // Find the caterer by ID and remove it from the list
            const caterer = pendingCaterers.find(caterer => caterer._id === catererId);
            const catererName = caterer ? caterer.name : 'Unknown Caterer';

            setPendingCaterers(pendingCaterers.filter(caterer => caterer._id !== catererId));
            window.alert(`Caterer "${catererName}" verified successfully!`);
        } catch (error) {
            setError('Error verifying caterer');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h6>Pending Caterers</h6>

            <ListGroup>
                {pendingCaterers.map(caterer => (
                    <ListGroup.Item key={caterer._id}>
                        {caterer.name} - {caterer.location}
                        <Button
                            variant="primary"
                            onClick={() => handleVerify(caterer._id)}
                            style={{ marginLeft: '10px' }}
                        >
                            Verify
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default AdminDashboard;
