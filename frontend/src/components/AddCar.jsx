import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { URL, ACCESS_TOKEN } from '../constants';


function AddCar() {

    const [carData, setCarData] = useState({
        name: '',
        price: '',
        type: 'EVs',
        year: new Date().getFullYear(),
        description: '',
        engine: '',
        technology: '',
        dimensions: '',
        is_exclusive: 'True',
    });

    const [carImages, setCarImages] = useState({
        image_url: [],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCarData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (content, editor) => {
        setCarData((prevData) => ({
            ...prevData,
            description: content
        }));
    };

    const handleEngineDescription = (content, editor) => {
        setCarData((prevData) => ({
            ...prevData,
            engine: content
        }));
    };

    const handleTechnologyDescription = (content, editor) => {
        setCarData((prevData) => ({
            ...prevData,
            technology: content
        }));
    };

    const handleDimensionsChange = (content, editor) => {
        setCarData((prevData) => ({
            ...prevData,
            dimensions: content
        }));
    };


    // the configuration of adding a car to the DB

    const handleSubmit = async () => {
        try {
            // Prepare the car data payload
            const carPayload = {
                name: carData.name,
                price: carData.price,
                year: carData.year,
                type: carData.type,
                description: carData.description,
                engine: carData.engine,
                technology: carData.technology,
                dimensions: carData.dimensions,
                is_exclusive: carData.is_exclusive,
                images: carImages.image_url,
            };
            const response = await axios.post(`${URL}/car/new`, carPayload, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            });

            alert("Car and image addition successful");
        } catch (error) {
            alert("Car and image addition failed");
        }
    };


    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 20; i--) {
            years.push(i);
        }
        return years.map((year) => (
            <option key={year} value={year}>
                {year}
            </option>
        ));
    };

    // function to change images to string

    const handleImageChange = (event, field) => {
        const selectedFiles = event.target.files;

        const updateImages = async () => {
            const updatedImages = [...carImages[field]];

            for (let i = 0; i < selectedFiles.length; i++) {
                const reader = new FileReader();

                await new Promise((resolve) => {
                    reader.onload = (e) => {
                        updatedImages.push(e.target.result);
                        resolve();
                    };

                    if (selectedFiles[i]) {
                        reader.readAsDataURL(selectedFiles[i]);
                    }
                });
            }

            setCarImages((prevImages) => ({
                ...prevImages,
                [field]: updatedImages,
            }));
        };

        updateImages();
    };



    return <div>
        {/* Name */}
        <h2 className='car-name'>Add Car</h2>
        <label htmlFor='name' className='car-name'>Car Name:</label><br />
        <input type='text' id='name' name='name' className="full-width" value={carData.name} onChange={handleInputChange} /> <br />

        {/* Price */}
        <label htmlFor='price' className='car-name'>Car Price:</label><br />
        <input type='text' id='price' name='price' className="full-width" value={carData.price} onChange={handleInputChange} /><br />

        <label htmlFor='year' className='car-name'>Year:</label><br />
        <select id='year' name='year' className="selector-style" value={carData.year} onChange={handleInputChange}>
            {generateYearOptions()}
        </select><br />

        {/* Is Exclusive */}
        <label htmlFor='is_exclusive' className='car-name'>Is Exclusive:</label><br />
        <select id='is_exclusive' name='is_exclusive' className="selector-style" value={carData.is_exclusive} onChange={handleInputChange}>
            <option value='True' defaultValue>True</option>
            <option value='False' >False</option>
        </select><br />

        {/* type */}
        <label htmlFor='type' className='car-name'>Type</label><br />
        <select id='type' name='type' className="selector-style" value={carData.type} onChange={handleInputChange}>
            <option value='EVs' defaultValue>EVs</option>
            <option value='ICEs'>ICEs</option>
        </select><br />


        {/* handling multiple images */}

        <label htmlFor='images' className='car-name'>Car Images:</label><br />
        <input type='file' accept='image/*' multiple onChange={(e) => handleImageChange(e, 'image_url')} />
        <br />

        {/* Description */}
        <label htmlFor='description' className='car-name'>Description:</label>
        <Editor
            apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
            initialValue=""
            init={{

            }}
            onEditorChange={handleDescriptionChange}
        /><br />

        <label htmlFor='engine' className='car-name'>Engine Specs:</label>
        <Editor
            apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
            initialValue=""
            init={{
                plugins: 'lists',
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist',
            }}
            onEditorChange={handleEngineDescription}
        /><br />

        <label htmlFor='technology' className='car-name'>Technology Specs:</label>
        <Editor
            apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
            initialValue=""
            init={{
                plugins: 'lists',
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist',
            }}
            onEditorChange={handleTechnologyDescription}
        /><br />

        <label htmlFor='dimensions' className='car-name'>Dimensions Specs:</label>
        <Editor
            apiKey="wwoxxz32vi4wuhakjwzsrnk9lxphp0rhetxnhixk5q6iur2e"
            initialValue=""
            init={{
                plugins: 'lists',
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist',

            }}
            onEditorChange={handleDimensionsChange}
        /><br />

        {/* Other input fields for car data */}

        <button onClick={handleSubmit} className="add-button">Add Car</button>
    </div>
}

export default AddCar;
