import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { URL } from "../constants";

function SendEmail() {
    const [emailData, setEmailData] = useState({
        subject: '',
        body: '',
    });

    const handleEmailBodyChange = (content, editor) => {
        setEmailData((prevData) => ({
            ...prevData,
            body: content
        }));
    };

    const handleEmailInputChange = (event) => {
        const { name, value } = event.target;
        setEmailData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSend = async () => {
        try {
            // Prepare the email payload
            const emailPayload = {
                subject: emailData.subject,
                body: emailData.body,
            };

            // Send the payload to the backend
            const response = await fetch(`${URL}send-emails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailPayload),
            });

            if (response.ok) {
                console.log('Email sent successfully.');
            } else {
                console.error('Failed to send email.');
            }

        } catch (error) {
            console.error('Email sending failed:', error);
        }
    };

    return (
        <div>
        <div>
            <h2 className='car-name'>Send Newsletters to the subscribed person's</h2>
        </div>
            <label htmlFor='subject' className='car-name'>Email Subject:</label><br />
            <input type='text' id='subject' name='subject' className="full-width" value={emailData.subject} onChange={handleEmailInputChange} /><br />

            <label htmlFor='body' className='car-name'>Email body:</label>
            <Editor
                apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
                initialValue=""
                init={{
                    forced_root_block: "",
                    toolbar: "image",  // Include the "image" button in the toolbar
                    plugins: "image",
                }}
                onEditorChange={handleEmailBodyChange}
            /><br />

            <button onClick={handleSend} className="add-button">Send Email</button>
        </div>
    );
}

export default SendEmail;
