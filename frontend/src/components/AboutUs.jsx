import React, { useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { URL } from "../constants";

function AddAboutUs() {
    const [aboutUsData, setAboutUsData] = useState({
        about: '',
    });

    const handleAboutUsChange = (content, editor) => {
        setAboutUsData((prevData) => ({
            ...prevData,
            about: content
        }));
    };


    const handleAdd = async () => {
        try {
            const response = await fetch(`${URL}/add_about_us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    about: aboutUsData.about
                })
            });
    
            if (response.ok) {
                // Handle success, e.g., show a success message
                alert('About Us added successfully');
            } else {
                // Handle error, e.g., show an error message
                alert('Failed to add About Us');
            }
        } catch (error) {
            console.error('Error adding About Us', error);
        }
    };

    return (
        <div>
            <div>
                <h2 className="car-name">Add About Us Text</h2>
            </div>

            <label htmlFor='body' className="car-name">About Us:</label>
            <Editor
                apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
                initialValue=""
                init={{
                    forced_root_block: "",
                    toolbar: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image",
                    plugins: "image",
                }}
                onEditorChange={handleAboutUsChange}
            /><br />

            <button onClick={handleAdd} className="add-button">Add About Us</button>
        </div>
    );
}

export default AddAboutUs;
