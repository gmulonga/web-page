import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { URL } from '../constants';

function EditAboutUs() {
    const [aboutUsList, setAboutUsList] = useState([]);
    const [editedAboutUs, setEditedAboutUs] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        fetchAboutUs();
    }, []);

    const fetchAboutUs = async () => {
        try {
            const response = await axios.get(`${URL}/get_about_us`);
            setAboutUsList(response.data);
        } catch (error) {
            console.error('Error fetching about us:', error);
        }
    };

    const handleDeleteAboutUs = async (id) => {
        try {
            const response = await axios.delete(`${URL}/delete_about_us/${id}`);
            if (response.status === 204) {
                fetchAboutUs();
            } else {
                console.error('Failed to delete about us.');
            }
        } catch (error) {
            console.error('Error deleting about us:', error);
        }
    };

    const handleAboutUsChange = (propertyName, value) => {
        setEditedAboutUs(prevAboutUs => ({
            ...prevAboutUs,
            [propertyName]: value
        }));
    };

    const handleEditAboutUs = (id) => {
        const aboutUsToEdit = aboutUsList.find(aboutUs => aboutUs.id === id);
        if (aboutUsToEdit) {
            setEditedAboutUs(aboutUsToEdit);
            setShowModal(true);
        }
    };

    const handleUpdateAboutUs = async () => {
        try {
            const response = await axios.put(`${URL}/edit_about_us/${editedAboutUs.id}`, editedAboutUs);
            if (response.status === 204) {
                fetchAboutUs();
                setEditedAboutUs(null);
                handleClose();
            } else {
                console.error('Failed to update about us.');
            }
        } catch (error) {
            console.error('Error updating about us:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateAboutUs();
    };

    return (
        <div>
            <h2 className='car-name'>About Us</h2>
            <table className='testimony-table'>
                <thead className='testimony-head'>
                    <tr>
                        <th>Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody className='testimony-body'>
                    {aboutUsList.map(about => (
                        <tr key={about.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{about.about.substring(0, 30)}...</td>

                            
                            <td>
                                <button className='testimony-edit' onClick={() => handleEditAboutUs(about.id)}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className='testimony-button' onClick={() => handleDeleteAboutUs(about.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal centered show={showModal} onHide={handleClose} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit About Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedAboutUs && (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="editedAboutUs">
                                <Form.Label>About Us:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={editedAboutUs.about}
                                    onChange={(e) => handleAboutUsChange('about', e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="submit-modal">
                                Update
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EditAboutUs;
