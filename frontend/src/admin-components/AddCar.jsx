import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Message from '../components/Message';
import CarsAPI from '../services/carsAPI';
import { generateYearOptions } from '../utilis/utilis';
import CustomInput from '../Input-components/input';


function AddCar() {

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const carApi = new CarsAPI();

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

    const handleSubmit = async () => {
        try {
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
            const response = await carApi.addCar(carPayload);
            if (response.data.status == "success") {
                setMessage('Car added successfully!');
                setAlertType('alert-success');
            } else {
                setMessage('Error: car was not added! please use jpeg images');
                setAlertType('alert-danger');
            }
            setShowMessage(true);
        } catch (error) {
            setMessage('Error car was not added!');
            setAlertType('alert-danger');
            setShowMessage(true);
        }
    };


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
        <CustomInput
            name="Name"
            id="name"
            value={carData.name}
            onChange={handleInputChange}
        />
        <CustomInput
            name="Price"
            id="price"
            value={carData.price}
            onChange={handleInputChange}
        />

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

        {showMessage && (
            <Message
                message={message}
                onClose={() => setShowMessage(false)}
                alertType={alertType}
            />
        )}

        <button onClick={handleSubmit} className="cars-button full-width">Add Car</button>
    </div>
}

export default AddCar;
