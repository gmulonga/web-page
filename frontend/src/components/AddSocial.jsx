import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../constants';

function AddSocial() {
    const [formData, setFormData] = useState({
        phone: '',
        twitter: '',
        email: '',
        instagram: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${URL}/add_social`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('social added successfully!');
            } else {
                alert('Error adding social');
            }
        } catch (error) {
            console.error('Error adding social', error);
        }
    };

    const handleDeleteSocial = async (id) => {
        try {
            const response = await axios.delete(`${URL}/delete_social`);
            if (response.status === 200) {
                
            } else {
                console.error('Failed to delete socail');
            }
        } catch (error) {
            console.error('Error deleting social:', error);
        }
    };



    return (
        <div>
            <h2 className='car-name'>Social Media Platforms</h2>
            <label htmlFor='phone' className='car-name'>Phone:</label><br />
            <input type='text' id='phone' name='phone' className="full-width" value={formData.phone} onChange={handleInputChange} /><br />

            <label htmlFor='email' className='car-name'>Email:</label><br />
            <input type='text' id='email' name='email' className="full-width" value={formData.email} onChange={handleInputChange} /><br />

            <label htmlFor='twitter' className='car-name'>Twitter:</label><br />
            <input type='text' id='twitter' name='twitter' className="full-width" value={formData.twitter} onChange={handleInputChange} /><br />

            <label htmlFor='instagram' className='car-name'>Instagram:</label><br />
            <input type='text' id='instagram' name='instagram' className="full-width" value={formData.instagram} onChange={handleInputChange} /><br />

            <button onClick={handleSubmit} className="add-button">Add Social</button>
            <div className='space' />
            <button onClick={handleDeleteSocial} className="add-button">Remove Current Social</button>
        </div>
    );
}

export default AddSocial;
