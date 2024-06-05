import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../constants";

function UpdateEmail() {
    const [id, setId] = useState(1); // Set the ID for fetching current email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    useEffect(() => {
        const fetchCurrentEmail = async () => {
            try {
                const response = await axios.get(`${URL}/get-email-configurations/${id}`);
                if (response.status === 200) {
                    const currentEmail = response.data.email;
                    setCurrentEmail(currentEmail);
                } else {
                    console.error('Failed to fetch current email.');
                }
            } catch (error) {
                console.error('Fetching current email failed:', error);
            }
        };

        // Call the fetch function
        fetchCurrentEmail();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${URL}/update-email/${id}`, {
                email: email,
                password: password,
            });

            if (response.status === 204) { // Check for 204 No Content status
                console.log('Email updated successfully.');
            } else {
                console.error('Failed to update email.');
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div>
            <h2 className="car-name">Change Email Credentials</h2>

            <label htmlFor='email' className="car-name">New Email:</label><br />
            <input type='text' id='email' name='email' className="full-width" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

            <label htmlFor='current-email' className="car-name">Current Email:</label><br />
            <input type='text' id='current-email' name='current-email' className="full-width" value={currentEmail} readOnly /><br />

            <label htmlFor='new-password' className="car-name">New Password:</label><br />
            <input type='text' id='new-password' name='new-password' className="full-width" value={password} onChange={(e) => setPassword(e.target.value)} /><br />

            <button onClick={handleUpdate} className="add-button">Change Credentials</button>
        </div>
    );
}

export default UpdateEmail;
