import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';

function DeleteSparePart() {
    const [spareList, setSpareList] = useState([]);

    useEffect(() => {
        fetchSpares();
    }, []);

    const fetchSpares = async () => {
        try {
            const response = await axios.get(`${URL}/get_spare_parts`);
            setSpareList(response.data.spare_parts); 
        } catch (error) {
            console.error('Error fetching spare parts:', error);
        }
    };

    const handleDeleteSpare = async (id) => {
        try {
            const response = await axios.delete(`${URL}/delete_spare_part/${id}`);
            if (response.status === 200) {
                fetchSpares();
            } else {
                console.error('Failed to delete spare part');
            }
        } catch (error) {
            console.error('Error deleting spare part:', error);
        }
    };


    return (
        <div>
            <h2 className='car-name'>Delete Spare Parts</h2>
            <table className='testimony-table'>
                <thead className='testimony-head'>
                    <tr>
                        <th className='car-name'>Make</th>
                        <th className='car-name'>Year</th>
                        <th className='car-name'>Chassis No.</th>
                        <th className='car-name'>Delete</th>
                    </tr>
                </thead>
                <tbody className='testimony-body'>
                    {spareList.map(spare => (
                        <tr key={spare.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{spare.make}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{spare.year}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{spare.chassis_no}</td> 
                            <td>
                                <button className='testimony-button' onClick={() => handleDeleteSpare(spare.id)}>
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

export default DeleteSparePart;
