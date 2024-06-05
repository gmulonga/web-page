import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeletePartner() {
    const [partnerList, setPartnerList] = useState([]);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await axios.get(`${URL}/get_partners`);
            setPartnerList(response.data);
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };

    const handleDeletePartner = async (id) => {
        try {
            const response = await axios.delete(`${URL}/delete_partner/${id}`);
            if (response.status === 200) {
                fetchPartners();
            } else {
                console.error('Failed to delete partner');
            }
        } catch (error) {
            console.error('Error deleting partner:', error);
        }
    };

    return (
        <div>
            <h2 className='car-name'>Partners</h2>
            <table className='testimony-table'>
                <thead className='testimony-head'>
                    <tr>
                        <th className='car-name'>Name</th>
                        <th className='car-name'>Delete</th>
                    </tr>
                </thead>
                <tbody className='testimony-body'>
                    {partnerList.map(partner => (
                        <tr key={partner.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{partner.name}</td>
                            <td>
                                <button className='testimony-button' onClick={() => handleDeletePartner(partner.id)}>
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

export default DeletePartner;
