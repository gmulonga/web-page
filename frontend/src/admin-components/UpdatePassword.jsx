import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../constants";

function UpdateCredentials() {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        const fetchCurrentCredentials = async () => {
            try {
                const response = await axios.get(`${URL}/get-credentials/1`);
                if (response.status === 200) {
                    const currentCredentials = response.data;
                    setCurrentPassword(currentCredentials.password_hash); 
                } else {
                    console.error('Failed to fetch current credentials.');
                }
            } catch (error) {
                console.error('Fetching current credentials failed:', error);
            }
        };

        // Call the fetch function
        fetchCurrentCredentials();
    }, []);

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`${URL}/update-credentials/1`, {
                username: username,
                password: newPassword,
            });

            if (response.status === 200) {
                console.log('Login credentials updated successfully.');
            } else {
                console.error('Failed to update login credentials.');
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div>
            <h2 className="car-name">Change Password</h2>

            <label htmlFor='username' className="car-name">Username:</label><br />
            <input type='text' id='username' name='username' className="full-width" value={username} onChange={(e) => setUsername(e.target.value)} /><br />

            <label htmlFor='new-password' className="car-name">New Password:</label><br />
            <input type='text' id='new-password' name='new-password' className="full-width" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><br />

            <button onClick={handleUpdate} className="add-button">Change Password</button>
        </div>
    );
}

export default UpdateCredentials;
