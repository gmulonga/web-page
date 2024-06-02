import React, { useState, useEffect } from "react";
import HeaderPage from "../components/HeaderPage";
import SelectedCarImages from "../components/SelectedCarImages";
import { useParams } from "react-router-dom";
import WhatsnewCard from "../components/WhatsnewCard";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import mixitup from "mixitup";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faCar, faCogs } from '@fortawesome/free-solid-svg-icons';
import { URL } from "../constants";

function SelectedCar() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [bigImage, setBigImage] = useState(null);
    const [carType, setCarType] = useState([]);
    const [activeFilter, setActiveFilter] = useState(".performance");
    const [showPerformance, setShowPerformance] = useState(true);
    const [showTechnology, setShowTechnology] = useState(false);
    const [showDimensions, setShowDimensions] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);


    // handling the modal form submission 
    function isValidEmail(email) {
        // Regular expression pattern to validate an email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const car_id = id;

        // Check if the email is valid
        if (!isValidEmail(email)) {
            alert('Invalid email format'); // Show an error message for invalid email
            return;
        }

        const formData = {
            name: name,
            email: email,
            phone: phone,
            car_id: car_id
        };

        // Send the form data to the Flask API route
        axios.post(`${URL}/add_request`, formData)
            .then((response) => {
                console.log(response.data); // Display the response from the server
                // Handle success, e.g., show a success message to the user
                handleClose();
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error, e.g., show an error message to the user
            });
    };




    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`${URL}/cars/${id}`);
                if (response.ok) {
                    const carData = await response.json();
                    setCar(carData);
                    setBigImage(carData ? carData.images[0] : "../images/beemer.jpeg");
                } else {
                    // Handle the error case
                    console.error("Failed to fetch car");
                }
            } catch (error) {
                // Handle any network errors
                console.error("Error fetching car", error);
            }
        };

        fetchCar();
    }, [id]);



    useEffect(() => {
        if (car?.name) {
            const fetchCarsByType = async () => {
                try {
                    const response = await fetch(`${URL}/get-cars/${car.name}`);
                    if (response.ok) {
                        const carsData = await response.json();
                        setCarType(carsData);
                    } else {
                        console.error('Failed to fetch cars');
                    }
                } catch (error) {
                    console.error('Error fetching cars', error);
                }
            };

            fetchCarsByType();
        }
    }, [car]);

    useEffect(() => {
        // Check if the container element exists before initializing mixitup
        const containerEl = document.querySelector(".featured__filter");
        if (containerEl) {
            const mixer = mixitup(containerEl);

            // Clean up MixItUp instance on component unmount
            return () => {
                mixer.destroy();
            };
        }
    }, []);


    const filterStateMap = {
        ".technology": "setShowTechnology", // Add the dot in the key
        ".dimensions": "setShowDimensions",
        ".performance": "setShowPerformance", // Add the dot in the key
    };

    const filterNames = [
        { name: ".technology", label: "Engine" },
        { name: ".dimensions", label: "Dimensions" },
        { name: ".performance", label: "Performance" },
    ];



    const handleFilterClick = (filter) => {
        setActiveFilter(filter);

        Object.keys(filterStateMap).forEach((key) => {
            const stateVariable = filterStateMap[key];
            if (key === filter) {
                eval(`${stateVariable}(true)`);
            } else {
                eval(`${stateVariable}(false)`);
            }
        });
    };

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleImageClick = (image, index) => {
        setBigImage(image);
        setActiveImageIndex(index);
    };


    const carsWithBase64Images = carType.map((carEntry) => ({
        ...carEntry,
        image:
            carEntry.images.length > 0
                ? `${carEntry.images[0].image_base64}`
                : "",
    }));



    return (
        <div>
            <section className="product-details spad">
                <HeaderPage
                    label={car ? car.year + " " + car.name : "Loading..."}
                    image={car ? car.images[0] : "../images/beemer.jpeg"}
                />
                <div className="selected-car-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div>
                                    <img
                                        className="selected-car big-image"
                                        src={bigImage || "../images/beemer.jpeg"}
                                        alt=""
                                    />
                                </div>

                                <OwlCarousel className="car-carousel" autoplay>
                                    {car?.images.map((image, index) => (
                                            <SelectedCarImages
                                                key={index}
                                                image={image} // Use the image from the database
                                                onClick={(image, index) => handleImageClick(image, index)}
                                            />
                                        ))}
                                </OwlCarousel>

                            </div>

                            <div className="col-lg-6 col-md-6">
                                <div className="product__details__text">
                                    <h3 className="car-name">{car ? car.year : "year"} {car ? car.name : "car name"}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: car ? car.description : "" }} />

                                    <div className="row price">
                                        <div className="col-lg-6">
                                            <h4 className="car-name">Ksh: {car ? car.price : "1,200,000"}</h4>
                                        </div>
                                        <div className="col-lg-6">
                                            <button class="make-request" onClick={handleShow}>Make Request</button>
                                        </div>
                                    </div>

                                    <div>

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


                        </div>
                    </div>
                </div>
            </section>

            <div>
                <div className="container">
                    <div className="featured__controls">
                        <ul>
                            <li
                                className={activeFilter === ".performance" ? "active" : ""}
                                onClick={() => handleFilterClick(".performance")}
                            >
                                Performance
                                <FontAwesomeIcon icon={faCogs} className="icon" />
                            </li>
                            <li
                                className={activeFilter === ".technology" ? "active" : ""}
                                onClick={() => handleFilterClick(".technology")}
                            >
                                Technology
                                <FontAwesomeIcon icon={faMicrochip} className="icon" />
                            </li>
                            <li
                                className={activeFilter === ".dimensions" ? "active" : ""}
                                onClick={() => handleFilterClick(".dimensions")}
                            >
                                Dimensions & Interior
                                <FontAwesomeIcon icon={faCar} className="icon" />

                            </li>
                        </ul>
                    </div>
                </div>

                <div className="center">
                    <div className={`featured__filter conatainer specs ${showPerformance ? "performance" : ""}`} style={{ display: showPerformance ? "block" : "none" }}>
                        <div className="specs-items">
                            <div className="row">
                                <div className="col-lg-6">
                                    <img src="../images/engine.png" className="spec-image" />
                                </div>
                                <div className="col-lg-6 center">
                                    <table className="specs-table">
                                        <div dangerouslySetInnerHTML={{ __html: car ? car.engine : "" }} />
                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="center">
                    <div className={`featured__filter conatainer specs ${showDimensions ? "dimensions" : ""}`} style={{ display: showDimensions ? "block" : "none" }}>
                        <div className="specs-items">
                            <div className="row">
                                <div className="col-lg-6">
                                    <img src="../images/logo.jpeg" className="spec-image" />
                                </div>
                                <div className="col-lg-6 center">
                                    <table className="specs-table">
                                        <tbody>
                                            <div dangerouslySetInnerHTML={{ __html: car ? car.dimensions : "" }} />
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="center">
                    <div className={`featured__filter conatainer specs ${showTechnology ? "technology" : ""}`} style={{ display: showTechnology ? "block" : "none" }}>
                        <div className="specs-items">
                            <div className="row">
                                <div className="col-lg-6">
                                    <img src="https://img.freepik.com/premium-vector/futuristic-autonomous-car-with-flat-design_23-2147884794.jpg" className="spec-image" />
                                </div>
                                <div className="col-lg-6 center">
                                    <table className="specs-table">
                                        <tbody>
                                            <div dangerouslySetInnerHTML={{ __html: car ? car.technology : "" }} />
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </div>



            <div className="container similar-cars">
                <h1 className="heading-label">Explore more on {car?.name}</h1>

                <OwlCarousel
                    className="owl-theme"
                    items={3}
                    responsive={{
                        0: { items: 1 },
                        868: { items: 3 },
                    }}
                >
                    {carsWithBase64Images.map((carEntry) => (
                        <WhatsnewCard
                            key={carEntry.id}
                            id={carEntry.id}
                            name={carEntry.name}
                            image={carEntry.image} // Use the processed image from carsWithBase64Images
                            price={carEntry.price}
                        />
                    ))}
                </OwlCarousel>


            </div>
        </div>
    );
}

export default SelectedCar;