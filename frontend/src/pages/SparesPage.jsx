import React, { useState } from "react";
import HeaderPage from "../components/HeaderPage";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { URL } from "../constants";

function SparesPage() {
  const currentYear = new Date().getFullYear();
  const years = [];
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [selectedSpareId, setSelectedSpareId] = useState(null);

  for (let i = currentYear; i >= currentYear - 20; i--) {
    years.push(i);
  }

  const [sparesList, setSparesList] = useState([]);
  const [searchResultMessage, setSearchResultMessage] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const carMake = event.target.elements.carMake.value;
    const year = event.target.elements.year.value;

    try {
      const response = await axios.get(`${URL}/get_spare_parts/${carMake}/${year}`);
      setSparesList(response.data.spare_parts);
      setSearchResultMessage(response.data.spare_parts.length > 0 ? "" : "No spares available.");
    } catch (error) {
      console.error("Error fetching spares:", error);
      setSearchResultMessage("No spares found!");
    }
  };

  const handleRequest = (spareId) => {
    setSelectedSpareId(spareId);
    handleShow();
  };

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;

    if (!isValidEmail(email)) {
      alert('Invalid email format');
      return;
    }

    const formData = {
      name: name,
      email: email,
      phone: phone,
      spare_id: selectedSpareId 
    };

    axios.post(`${URL}/add_spare_request`, formData)
      .then((response) => {
        console.log(response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <HeaderPage label="Spare Parts" image="./images/spares.jpeg" />

      <div className="container space">
        <div className="spares-form">
          <form onSubmit={handleSearch}>
            <label htmlFor="carMake">Car Make:</label>

            <select id="carMake" name="carMake">
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
            </select>

            <label htmlFor="year">Year:</label>
            <select id="year" name="year">
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <br />

            <button type="submit" className="add-button">Search</button>
          </form>

          <div className="space">
            <p>{searchResultMessage}</p>
            {sparesList.length > 0 && (
              <table className="testimony-table">
                <thead>
                  <tr>
                    <th>Make</th>
                    <th>Year</th>
                    <th>Chassis No.</th>
                    <th>Part No.</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="testimony-body">
                  {sparesList.map((spare) => (
                    <tr key={spare.id}>
                      <td>{spare.make}</td>
                      <td>{spare.year}</td>
                      <td>{spare.chassis_no}</td>
                      <td>{spare.part_no}</td>
                      <td>
                        <button className="add-button" onClick={() => handleRequest(spare.id)}>Request</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Modal centered show={showModal} onHide={handleClose} className="custom-modal">
            <Modal.Header closeButton style={{ color: 'white' }}>
              <Modal.Title>Make a Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label className="car-name">Name:</Form.Label>
                  <Form.Control type="name" placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label className="car-name">Email:</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group controlId="phone">
                  <Form.Label className="car-name">Phone Number:</Form.Label>
                  <Form.Control type="tel" placeholder="Enter your phone number" required />
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-modal">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SparesPage;
