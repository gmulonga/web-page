import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { URL } from '../constants';

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [editedTestimonial, setEditedTestimonial] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await axios.get(`${URL}/testimony`);
            setTestimonials(response.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    const handleDeleteTestimonial = async (id) => {
        try {
            const response = await axios.delete(`${URL}/testimony/${id}`);
            if (response.status === 204) {
                fetchTestimonials();
            } else {
                console.error('Failed to delete testimonial.');
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };


    const handleTestimonialChange = (propertyName, value) => {
        setEditedTestimonial(prevTestimonial => ({
            ...prevTestimonial,
            [propertyName]: value
        }));
    };

    const handleEditTestimonial = (id) => {
        const testimonialToEdit = testimonials.find(testimonial => testimonial.id === id);
        if (testimonialToEdit) {
            setEditedTestimonial(testimonialToEdit);
            setShowModal(true);
        }
    };

    const handleUpdateTestimonial = async () => {
        try {
            const response = await axios.put(`${URL}/testimony/${editedTestimonial.id}`, editedTestimonial);
            if (response.status === 204) {
                fetchTestimonials();
                setEditedTestimonial(null);
            } else {
                console.error('Failed to update testimonial.');
            }
        } catch (error) {
            console.error('Error updating testimonial:', error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateTestimonial();
        handleClose();
    };


    return (
        <div>
            <h2>Testimonials</h2>
            <table className='testimony-table'>
                <thead className='testimony-head'>
                    <tr>
                        <th>Name</th>
                        <th>Testimony</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody className='testimony-body'>
                    {testimonials.map(testimonial => (
                        <tr key={testimonial.id}>
                            <td>{testimonial.name}</td>
                            <td>{testimonial.testimony.substring(0, 30)}...</td>
                            <td>
                                <button className='edit-button' onClick={() => handleEditTestimonial(testimonial.id)}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className='delete-button' onClick={() => handleDeleteTestimonial(testimonial.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal centered show={showModal} onHide={handleClose} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Testimonial</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedTestimonial && ( // Add this conditional check
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="editedTestimonialName">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editedTestimonial.name}
                                    onChange={(e) => handleTestimonialChange('name', e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="editedTestimonialTestimony">
                                <Form.Label>Testimony:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={editedTestimonial.testimony}
                                    onChange={(e) => handleTestimonialChange('testimony', e.target.value)}
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

export default Testimonials;
