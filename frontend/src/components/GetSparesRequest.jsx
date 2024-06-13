import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { URL } from '../constants';

function SpareRequests() {
    const [spareRequests, setSpareRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSpare, setSelectedSpare] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        fetchSpareRequests();
    }, []);

    const fetchSpareRequests = async () => {
        try {
            const response = await axios.get(`${URL}/get_spares_requests`);
            setSpareRequests(response.data.requests); // Set the 'requests' array to state
        } catch (error) {
            console.error('Error fetching spare requests:', error);
        }
    };

    const handleDeleteSpareRequest = async (id) => {
        try {
            const response = await axios.delete(`${URL}/delete_spare_request/${id}`);
            if (response.status === 200) {
                fetchSpareRequests();
            } else {
                console.error('Failed to delete spare request.');
            }
        } catch (error) {
            console.error('Error deleting spare request:', error);
        }
    };

    const handleGetSpare = async (spareId) => {
        try {
            const response = await axios.get(`${URL}/get_spare_part/${spareId}`);
            const spareData = response.data;
            setSelectedSpare(spareData); // Set selected car data
            handleShow(); // Show the car modal
            console.log('Car Data:', spareData);
        } catch (error) {
            console.error('Error fetching spare data:', error);
        }
    };

    const handleCloseSpareModal = () => {
        setSelectedSpare(null);
        handleClose(); // Close the car modal
    };

    return (
        <div>
            <h2 className='car-name'>Spare Requests</h2>
            <div className='row'>
                {spareRequests.map(request => (
                    <div key={request.id} className=''>
                        <Card>
                            <Card.Body>
                                <Card.Text>Name: {request.name}</Card.Text>
                                <Card.Text>Email: {request.email}</Card.Text>
                                <Card.Text>Phone: {request.phone}</Card.Text>
                                <Button variant="primary" style={{ backgroundColor: '#041C32', marginRight: '5px', width: '49%' }} onClick={() => handleGetSpare(request.spare_id)}>Show Spare</Button>
                                <Button className='testimony-button' style={{ backgroundColor: '#F94C10', width: '49%' }} variant="danger" onClick={() => handleDeleteSpareRequest(request.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>



            <Modal centered show={showModal} onHide={handleCloseSpareModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Spare Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSpare && (
                        <div>
                            <p>Make: {selectedSpare.make}</p>
                            <p>Year: {selectedSpare.year}</p>
                            <p>Chassis no: {selectedSpare.chassis_no}</p>
                            <p>Part no: {selectedSpare.part_no}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SpareRequests;
