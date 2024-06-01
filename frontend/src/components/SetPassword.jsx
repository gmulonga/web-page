import React, { useState } from "react";
import { URL } from "../constants";

function SetPassword() {
    const [passwordData, setPasswordData] = useState({
        email: '',
        password: '',
    });

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAdd = async () => {
        try {
            const passwordPayload = {
                username: passwordData.username,
                password: passwordData.password,
            };

            const response = await fetch(`${URL}/add-credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordPayload),
            });

            if (response.ok) {
                console.log('Password added successfully.');
            } else {
                console.error('Failed to add password.');
            }
        } catch (error) {
            console.error('Password adding failed:', error);
        }
    };

    return (
        <div>
            <div>
                <h2 className="car-name">Set Password</h2>
            </div>
            <label htmlFor='username' className="car-name">Username:</label><br />
            <input type='text' id='username' name='username' className="full-width" value={passwordData.username} onChange={handlePasswordChange} /><br />

            <label htmlFor='password' className="car-name">Password:</label><br />
            <input type='text' id='password' name='password' className="full-width" value={passwordData.password} onChange={handlePasswordChange} /><br />
            
            <button onClick={handleAdd} className="add-button">Set Password</button>
        </div>
    );
}

export default SetPassword;
