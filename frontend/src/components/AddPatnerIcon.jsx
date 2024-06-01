import React, { useState } from "react";
import { URL } from "../constants";

function AddPartner() {
    const [partnerData, setPartnerData] = useState({
        name: '',
    });

    const [partnerImage, setPartnerImage] = useState(null);

    const handleNameInputChange = (event) => {
        const { name, value } = event.target;
        setPartnerData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPartnerImage(e.target.result); // Set the base64-encoded image string
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAdd = async () => {
        try {
            if (!partnerData.name || !partnerImage) {
                console.error('Please provide partner name and image.');
                return;
            }

            const partnerPayload = {
                name: partnerData.name,
                image_base64: partnerImage,
            };

            const response = await fetch(`${URL}/add_partner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partnerPayload),
            });

            if (response.ok) {
                alert("Partner added successfully.");
                console.log('Partner added successfully.');
            } else {
                alert("Failed to add partner.")
                console.error('Failed to add partner.');
            }
        } catch (error) {
            alert("Partner addition failed.")
            console.error('Partner addition failed:', error);
        }
    };

    return (
        <div>
            <div>
                <h2 className='car-name'>Add The Partner Logos</h2>
            </div>
            <label htmlFor='name' className='car-name'>Partner Name:</label><br />
            <input type='text' id='name' name='name' className="full-width" value={partnerData.name} onChange={handleNameInputChange} /><br />

            <label htmlFor='image' className='car-name'>Partner Logo:</label><br />
            <input type='file' accept='image/*' onChange={handleImageChange} />
            <br />
            <div className="spaceabove"></div>

            <button onClick={handleAdd} className="add-button">Add Partner</button>
        </div>
    );
}

export default AddPartner;
