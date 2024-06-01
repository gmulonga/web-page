import React, { useState } from 'react';

function CarModal({ onClose }) {
  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState('');

  const handleCarNameChange = (event) => {
    setCarName(event.target.value);
  };

  const handleCarPriceChange = (event) => {
    setCarPrice(event.target.value);
  };

  const handleAddCar = () => {
    // Implement your logic to add the car here
    // For this example, let's just log the car details
    console.log('Adding car:', carName, carPrice);
    onClose(); // Close the modal
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>&times;</span>
        <h2 className='car-name'>Add Car</h2>
        <label htmlFor='carName' className='car-name'>Car Name:</label>
        <input type='text' id='carName' value={carName} onChange={handleCarNameChange} />
        <label htmlFor='carPrice' className='car-name'>Car Price:</label>
        <input type='text' id='carPrice' value={carPrice} onChange={handleCarPriceChange} />
        <button onClick={handleAddCar} className='car-name'>Add Car</button>
      </div>
    </div>
  );
}

export default CarModal;
