import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL, ACCESS_TOKEN } from '../constants';
import CarsAPI from '../services/carsAPI';

function CarList() {
    const [cars, setCars] = useState([]);
    const carsApi = new CarsAPI();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await carsApi.getCars();
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleDeleteCar = async (id) => {
        try {
            const response = await carsApi.deleteCar(id);
            if (response.data.status === 'success') {
                fetchCars();
            } else {
                console.error('Failed to delete car:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    return (
        <div>
            <h2 className='car-name'>Car List</h2>

            <table className='testimony-table'>
                <thead className='testimony-head'>
                    <tr>
                        <th className='car-name'>Car ID</th>
                        <th className='car-name'>Name</th>
                        <th className='car-name'>Year</th>
                        <th className='car-name'>Delete</th>
                    </tr>
                </thead>
                <tbody className='testimony-body'>
                    {cars.map(car => (
                        <tr key={car.id}>
                            <td>{car.id}</td>
                            <td>{car.name}</td>
                            <td>{car.year}</td>
                            <td>
                                <button className='testimony-button' onClick={() => handleDeleteCar(car.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>



        </div>
    );
}

export default CarList;
