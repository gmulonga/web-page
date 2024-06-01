import React, { useState } from 'react';
import { URL } from '../constants';

function AddSparePart() {
    const [formData, setFormData] = useState({
        make: 'Ford',
        year: new Date().getFullYear(),
        chassis_no: '',
        part_no: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${URL}/add_spare_part`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    make: formData.make,
                    year: formData.year,
                    chassis_no: formData.chassis_no,
                    part_no: formData.part_no
                })
            });

            if (response.ok) {
                alert('Spare part added successfully!');
            } else {
                alert('Error adding spare part');
            }
        } catch (error) {
            console.error('Error adding spare part', error);
        }
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 20; i--) {
            years.push(i);
        }
        return years.map((year) => (
            <option key={year} value={year.toString()}> {/* Convert year to string */}
                {year}
            </option>
        ));
    };

    return (
        <div>
            <h2 className='car-name'>Add Spare Part</h2>
            <label htmlFor='make' className='car-name'>Make:</label><br />
            <select id='make' name='make' className="full-width option-style" value={formData.make} onChange={handleInputChange}>
                <option value="Ford">Ford</option>
                <option value="Toyota">Toyota</option>
                <option value="BMW">BMW</option>
                <option value="Chevrolet">Chevrolet</option>
                <option value="Honda">Honda</option>
                <option value="Nissan">Nissan</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Subaru">Subaru</option>
                <option value="Mazda">Mazda</option>
                <option value="Lexus">Lexus</option>
                <option value="Porsche">Porsche</option>
                <option value="Jeep">Jeep</option>
                <option value="Chrysler">Chrysler</option>
                <option value="Volvo">Volvo</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Infiniti">Infiniti</option>
                <option value="GMC">GMC</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Mini">Mini</option>
                <option value="Fiat">Fiat</option>
                <option value="Lincoln">Lincoln</option>
                <option value="Dodge">Dodge</option>
                <option value="Maserati">Maserati</option>
                <option value="Chrysler">Chrysler</option>
                <option value="Bentley">Bentley</option>
            </select><br />

            <label htmlFor='chassis' className='car-name'>Chassis Number:</label><br />
            <input type='text' id='chassis_no' name='chassis_no' className="full-width" value={formData.chassis_no} onChange={handleInputChange} /><br />

            <label htmlFor='year' className='car-name'>Year:</label><br />
            <select id='year' name='year' className="selector-style" value={formData.year} onChange={handleInputChange}>
                {generateYearOptions()}
            </select><br />

            <label htmlFor='part_no' className='car-name'>Part Number:</label><br />
            <input type='text' id='part_no' name='part_no' className="full-width" value={formData.part_no} onChange={handleInputChange} /><br />

            <button onClick={handleSubmit} className="add-button">Add Spare Part</button>
        </div>
    );
}

export default AddSparePart;
