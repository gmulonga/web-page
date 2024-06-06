import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN } from '../constants';


export default class CarsAPI {
    constructor(siteId) {
        this.siteId = siteId;
    }

    async getRequest(url) {
        try {
            const response = await axios.get(url);
            return { data: response.data, error: null, isLoading: false };
        } catch (error) {
            return { data: null, error, isLoading: false };
        }
    }

    async postRequest(url, payload, method = 'POST') {
        try {
            const response = await axios({
                method: method,
                url: url,
                data: payload,
            });
            return { data: response.data, error: null, isLoading: false };
        } catch (error) {
            return { data: null, error, isLoading: false };
        }
    }

    async deleteRequest(url) {
        try {
            const response = await axios.delete(url);
            return { data: response.data, error: null, isLoading: false };
        } catch (error) {
            return { data: null, error, isLoading: false };
        }
    }

    getCars() {
        const url = `${API_BASE_URL}/cars`;
        return this.getRequest(url);
    }

    getCarById(id) {
        let url = `${API_BASE_URL}/car/${id}`;
        return this.getRequest(url);
    }

    getCarsByName(name) {
        let url = `${API_BASE_URL}/cars/${name}`;
        return this.getRequest(url);
    }

    getCarImages(carId) {
        let url = `${API_BASE_URL}/car/${carId}/images`;
        return this.getRequest(url);
    }

    getEVs() {
        const url = `${API_BASE_URL}/cars/evs`;
        return this.getRequest(url);
    }

    getEVsByName(name) {
        let url = `${API_BASE_URL}/cars/evs/${name}`;
        return this.getRequest(url);
    }

    getExclusiveCars() {
        const url = `${API_BASE_URL}/cars/exclusive`;
        return this.getRequest(url);
    }

    addCar(carData, ACCESS_TOKEN) {
        const url = `${API_BASE_URL}/car/new`;
        return this.postRequest(url, carData, 'POST', {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    }

    deleteCar(id, ACCESS_TOKEN) {
        let url = `${API_BASE_URL}/car/delete/${id}`;
        return this.deleteRequest(url, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    }

    getTestimonies() {
        const url = `${API_BASE_URL}/testimony`;
        return this.getRequest(url);
    }

    getTestimony(id) {
        let url = `${API_BASE_URL}/testimony/${id}`;
        return this.getRequest(url);
    }

    addTestimony(testimonyData, ACCESS_TOKEN) {
        const url = `${API_BASE_URL}/testimony/new`;
        return this.postRequest(url, testimonyData, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        })
    }

    deleteTestimony(id, ACCESS_TOKEN) {
        let url = `${API_BASE_URL}/testimony/delete/${id}`;
        return this.deleteRequest(url, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    }
}
