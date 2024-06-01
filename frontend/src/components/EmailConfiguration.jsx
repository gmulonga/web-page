import React, { useState } from "react";
import { URL } from "../constants";

function EmailConfiguration() {
    const [emailData, setEmailData] = useState({
        email: '',
        password: '',
    });

    const handleEmailChange = (event) => {
        const { name, value } = event.target;
        setEmailData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAdd = async () => {
        try {
            // Prepare the email configuration payload
            const emailPayload = {
                email: emailData.email,
                password: emailData.password,
            };

            // Send the payload to the backend
            const response = await fetch(`${URL}/add-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload),
            });

            if (response.ok) {
                
            } else {
                console.error('Failed to add email configuration.');
            }
        } catch (error) {
            console.error('Email configuration adding failed:', error);
        }
    };

    return (
        <div>
            <div>
                <h2 className="car-name">Email Configuration</h2>
            </div>
            <label htmlFor='email' className="car-name">Email:</label><br />
            <input type='text' id='email' name='email' className="full-width" value={emailData.email} onChange={handleEmailChange} /><br />

            <label htmlFor='password' className="car-name">Password:</label><br />
            <input type='text' id='password' name='password' className="full-width" value={emailData.password} onChange={handleEmailChange} /><br />
            
            <button onClick={handleAdd} className="add-button">Set Email</button>
        </div>
    );
}

export default EmailConfiguration;
