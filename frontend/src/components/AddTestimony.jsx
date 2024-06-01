import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { URL } from "../constants";

function AddTestimony() {
    const [testimonyData, setTestimonyData] = useState({
        name: '',
        testimony: '',
    });

    const handleTestimonyBodyChange = (content, editor) => {
        setTestimonyData((prevData) => ({
            ...prevData,
            testimony: content
        }));
    };

    const handleTestimonyName = (event) => {
        const { name, value } = event.target;
        setTestimonyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAdd = async () => {
        try {
            // Prepare the testimony payload
            const testimonyPayload = {
                name: testimonyData.name,
                testimony: testimonyData.testimony,
            };

            // Send the payload to the backend
            const response = await fetch(`${URL}/add-testimony`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonyPayload),
            });

            if (response.ok) {
                alert('Testimony sent successfully.');
            } else {
                alert('Failed to send testimony.');
            }
        } catch (error) {
            console.error('Testimony sending failed:', error);
        }
    };

    return (
        <div>
            <div>
                <h2>Add Testimony</h2>
            </div>
            <label htmlFor='name'>Name:</label><br />
            <input type='text' id='name' name='name' className="full-width" value={testimonyData.name} onChange={handleTestimonyName} /><br />

            <label htmlFor='body'>Testimony:</label>
            <Editor
                apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
                initialValue=""
                init={{
                    forced_root_block: "",
                    toolbar: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image",
                    plugins: "image",
                }}
                onEditorChange={handleTestimonyBodyChange}
            /><br />


            <button onClick={handleAdd} className="add-button">Add Testimony</button>
        </div>
    );
}

export default AddTestimony;
