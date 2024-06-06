import axios from 'axios';
import { TESTIMONY_URL, ACCESS_TOKEN, CARS_URL } from '../constants';


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
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });
            return { data: response.data, error: null, isLoading: false };
        } catch (error) {
            return { data: null, error, isLoading: false };
        }
    }

    async updateRequest(url, payload, method = 'PUT') {
        try {
            const response = await axios({
                method: method,
                url: url,
                data: payload,
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
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
        const url = `${CARS_URL}`;
        return this.getRequest(url);
    }

    getCarById(id) {
        let url = `${CARS_URL}/${id}`;
        return this.getRequest(url);
    }

    getCarsByName(name) {
        let url = `${CARS_URL}/${name}`;
        return this.getRequest(url);
    }

    getCarImages(carId) {
        let url = `${CARS_URL}/${carId}/images`;
        return this.getRequest(url);
    }

    getEVs() {
        const url = `${CARS_URL}/evs`;
        return this.getRequest(url);
    }

    getEVsByName(name) {
        let url = `${CARS_URL}/evs/${name}`;
        return this.getRequest(url);
    }

    getExclusiveCars() {
        const url = `${CARS_URL}/exclusive`;
        return this.getRequest(url);
    }

    addCar(carData) {
        const url = `${CARS_URL}/new`;
        return this.postRequest(url, carData);
    }

    deleteCar(id) {
        let url = `${CARS_URL}/delete/${id}`;
        return this.deleteRequest(url);
    }

    getTestimonies() {
        const url = `${TESTIMONY_URL}`;
        return this.getRequest(url);
    }

    getTestimony(id) {
        let url = `${TESTIMONY_URL}/${id}`;
        return this.getRequest(url);
    }

    addTestimony(testimonyData) {
        const url = `${TESTIMONY_URL}/new`;
        return this.postRequest(url, testimonyData)
    }

    deleteTestimony(id) {
        let url = `${TESTIMONY_URL}/delete/${id}`;
        return this.deleteRequest(url);
    }
}
