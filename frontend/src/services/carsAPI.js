import axios from 'axios';
import {
    TESTIMONY_URL,
    ACCESS_TOKEN,
    CARS_URL,
    REQUEST_URL,
    SPARE_PART_URL,
    SUBSCRIBE_URL,
    LOGIN_URL,
    LOGOUT_URL,
    CREDENTIALS_URL,
    SPARE_REQUEST_URL,
} from '../constants';


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
            console.log("this is the response")
            if (response.status === 200 && response.data.status === "success") {
                return { data: response.data, error: null, isLoading: false };
            } else {
                return { data: null, error: response.error || "Error occurred", isLoading: false };
            }
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

    async deleteRequest(url, method = 'DELETE') {
        try {
            const response = await axios({
                method: method,
                url: url,
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            })
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
        return this.postRequest(url, testimonyData);
    }

    deleteTestimony(id) {
        let url = `${TESTIMONY_URL}/delete/${id}`;
        return this.deleteRequest(url);
    }

    getRequests() {
        const url = `${REQUEST_URL}`;
        return this.getRequest(url);
    }

    addRequest(requestData) {
        const url = `${REQUEST_URL}/new`;
        return this.postRequest(url, requestData);
    }

    deleteCustomerRequest(id) {
        const url = `${REQUEST_URL}/delete/${id}`;
        return this.deleteRequest(url);
    }

    getSpareParts() {
        const url = `${SPARE_PART_URL}`;
        return this.getRequest(url);
    }

    getSparePart(id) {
        let url = `${SPARE_PART_URL}/${id}`;
        return this.getRequest(url);
    }

    addSparePart(spareData) {
        const url = `${SPARE_PART_URL}/new`;
        return this.postRequest(url, spareData);
    }

    deleteSparePart(id) {
        let url = `${SPARE_PART_URL}/delete/${id}`;
        return this.deleteRequest(url);
    }

    subscribe() {
        const url = `${SUBSCRIBE_URL}`;
        return this.postRequest(url);
    }

    login() {
        const url = `${LOGIN_URL}`;
        return this.postRequest(url);
    }

    logout() {
        const url = `${LOGOUT_URL}`;
        return this.postRequest(url);
    }

    getCredentials() {
        const url = `${CREDENTIALS_URL}`;
        return this.getRequest(url);
    }

    getCredential(id) {
        let url = `${CREDENTIALS_URL}/${id}`;
        return this.getRequest(url);
    }

    addCredential(credentialData) {
        const url = `${CREDENTIALS_URL}/new`;
        return this.postRequest(url, credentialData);
    }

    updateCredential(id, credentialData) {
        let url = `${CREDENTIALS_URL}/update/${id}`;
        return this.putRequest(url, credentialData);
    }

    getSpareRequests() {
        const url = `${SPARE_REQUEST_URL}`;
        return this.getRequest(url);
    }

    addSpareRequest(data) {
        const url = `${SPARE_REQUEST_URL}/new`;
        return this.postRequest(url, data);
    }

    deleteSpareRequest(id) {
        let url = `${SPARE_REQUEST_URL}/${id}`;
        return this.deleteRequest(url);
    }
}
