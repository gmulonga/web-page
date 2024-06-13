import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { URL } from '../constants';

function CustomerRequests() {
    const [customerRequests, setCustomerRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null); // New state for selected car

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        fetchCustomerRequests();
    }, []);

    const fetchCustomerRequests = async () => {
        try {
            const response = await axios.get(`${URL}/customer-requests`);
            setCustomerRequests(response.data);
        } catch (error) {
            console.error('Error fetching customer requests:', error);
        }
    };

    const handleDeleteCustomerRequest = async (id) => {
        try {
            const response = await axios.delete(`${URL}/customer-requests/${id}`);
            if (response.status === 200) {
                fetchCustomerRequests();
            } else {
                console.error('Failed to delete customer request.');
            }
        } catch (error) {
            console.error('Error deleting customer request:', error);
        }
    };

    const handleGetCar = async (carId) => {
        try {
            const response = await axios.get(`${URL}/cars/${carId}`);
            const carData = response.data;
            setSelectedCar(carData); // Set selected car data
            handleShow(); // Show the car modal
            console.log('Car Data:', carData);
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    };

    const handleCloseCarModal = () => {
        setSelectedCar(null);
        handleClose(); // Close the car modal
    };

    return (
        <div>
            <h2 className='car-name'>Customer Requests</h2>
            <div className='row'>
                {customerRequests.map(request => (
                    <div key={request.id} className='col-lg-6'>
                        <Card>
                            <Card.Body>
                                <Card.Text>Name: {request.name}</Card.Text>
                                <Card.Text>Email: {request.email}</Card.Text>
                                <Card.Text>Phone: {request.phone}</Card.Text>
                                <Button className='cars-button' onClick={() => handleGetCar(request.car_id)}>Show Car Info</Button>
                                <Button className='delete-button' onClick={() => handleDeleteCustomerRequest(request.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>



            <Modal centered show={showModal} onHide={handleCloseCarModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Car Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCar && (
                        <div>
                            <p>Name: {selectedCar.name}</p>
                            <p>Year: {selectedCar.year}</p>
                            <p>Car ID: {selectedCar.id}</p>
                            <p>Price: {selectedCar.price}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CustomerRequests;
