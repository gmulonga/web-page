import React, { useState, useEffect } from "react";
import HeaderPage from "../components/HeaderPage";
import SelectedCarImages from "../components/SelectedCarImages";
import { useParams } from "react-router-dom";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import mixitup from "mixitup";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { URL } from "../constants";
import CarCard from "../components/CarCard";
import CarsAPI from "../services/carsAPI";
import { openModal, closeModal } from "../utilis/utilis";
import Modal from "../components/Modal";
import { isValidEmail } from "../utilis/utilis";
import Message from "../components/Message";


function SelectedCar() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [bigImage, setBigImage] = useState(null);
    const [carType, setCarType] = useState([]);
    const [activeFilter, setActiveFilter] = useState(".performance");
    const [showPerformance, setShowPerformance] = useState(true);
    const [showTechnology, setShowTechnology] = useState(false);
    const [showDimensions, setShowDimensions] = useState(false);
    const carsApi = new CarsAPI();

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);


    const handleShowModal = () => {
        openModal(setModalVisible);
    };

    const handleCloseModal = () => {
        closeModal(setModalVisible);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const car_id = id;

        if (!isValidEmail(email)) {
            setMessage('Invalid Email format');
            setAlertType('alert-success');
        }

        const formData = {
            name: name,
            email: email,
            phone: phone,
            car_id: car_id
        };

        axios.post(`${URL}/request/new`, formData)
            .then((response) => {
                console.log(response.data);
                // handleClose();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    useEffect(() => {
        const fetchCar = async () => {
            const response = await carsApi.getCarById(id);
            if (response.data) {
                setCar(response.data);
                setBigImage(response.data.images ? response.data.images[0] : "../images/beemer.jpeg");
            }
        };

        fetchCar();
    }, [id]);


    useEffect(() => {
        if (car && car.name) {
            const fetchCarsByType = async () => {
                const response = await carsApi.getCarsByName(car.name);
                if (response.data) {
                    setCarType(response.data);
                }
            };
            fetchCarsByType();
        }
    }, [car]);

    useEffect(() => {
        const containerEl = document.querySelector(".featured__filter");
        if (containerEl) {
            const mixer = mixitup(containerEl);

            return () => {
                mixer.destroy();
            };
        }
    }, []);


    const filterStateMap = {
        ".technology": "setShowTechnology",
        ".dimensions": "setShowDimensions",
        ".performance": "setShowPerformance",
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

                                <OwlCarousel className="car-carousel" autoplay={true}>
                                    {car &&
                                        car.images.map((image, index) => (
                                            <SelectedCarImages
                                                key={index}
                                                image={image}
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

                                            <button className="cars-button" onClick={handleShowModal} role="button">Make Request</button>
                                            {isModalVisible && (
                                                <Modal
                                                    modal_id="exampleModal"
                                                    modal_title="Example Modal Title"
                                                    onClose={handleCloseModal}
                                                    button_name="Request"
                                                >
                                                    <p>This is the modal content.</p>
                                                </Modal>
                                            )}

                                        </div>
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
                                    <img src="../images/engine.png" className="spec-image"></img>
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
                                    <img src="../images/logo.jpeg" className="spec-image"></img>
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
                                    <img src="https://img.freepik.com/premium-vector/futuristic-autonomous-car-with-flat-design_23-2147884794.jpg" className="spec-image"></img>
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
                <h1 className="heading-label">Explore more on {car && car.name}</h1>

                <OwlCarousel
                    className="owl-theme"
                    items={3}
                    responsive={{
                        0: { items: 1 },
                        868: { items: 3 },
                    }}
                >
                    {carsWithBase64Images.map((carEntry) => (
                        <CarCard
                            key={carEntry.id}
                            id={carEntry.id}
                            name={carEntry.name}
                            image={carEntry.image}
                            price={carEntry.price}
                        />
                    ))}
                </OwlCarousel>


            </div>
        </div>
    );
}

export default SelectedCar;