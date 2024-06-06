import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Adjust the base URL as needed

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

  async getHomeData() {
    const url = `${API_BASE_URL}/`;
    return this.getRequest(url);
  }

  async getCars() {
    const url = `${API_BASE_URL}/cars`;
    return this.getRequest(url);
  }

  async getCarById(id) {
    let url = `${API_BASE_URL}/car/${id}`;
    return this.getRequest(url);
  }

  async getCarsByName(name) {
    let url = `${API_BASE_URL}/cars/${name}`;
    return this.getRequest(url);
  }

  async getCarImages(carId) {
    let url = `${API_BASE_URL}/car/${carId}/images`;
    return this.getRequest(url);
  }

  async getEVs() {
    const url = `${API_BASE_URL}/cars/evs`;
    return this.getRequest(url);
  }

  async getEVsByName(name) {
    let url = `${API_BASE_URL}/cars/evs/${name}`;
    return this.getRequest(url);
  }

  async getExclusiveCars() {
    const url = `${API_BASE_URL}/cars/exclusive`;
    return this.getRequest(url);
  }

  async addCar(carData, token) {
    const url = `${API_BASE_URL}/car/new`;
    return this.postRequest(url, carData, 'POST', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async deleteCar(id, token) {
    let url = `${API_BASE_URL}/car/delete/${id}`;
    return this.deleteRequest(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
