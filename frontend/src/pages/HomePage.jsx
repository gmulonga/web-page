import React, { useEffect, useState } from "react";
import ExclusiveOffersCard from "../components/ExclusiveOffersCard";
import WhatsnewCard from "../components/WhatsnewCard";
import TestimonialCard from "../components/TestimonialCard";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { URL } from "../constants";

function HomePage() {

    const [testimony, setTestimony] = useState([]);
    const [cars, setCars] = useState([]);
    const [exclusiveOffers, setExclusiveOffers] = useState([]);

    useEffect(() => {
        // fetching cars
        fetch(`${URL}/cars`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setCars(data))
            .catch((error) => console.log(error));

        // fetch testimonies
        fetch(`${URL}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setTestimony(data.testimonials))
            .catch((error) => console.log(error));

        // Fetch exclusive offers
        fetch(`${URL}/exclusive-cars`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setExclusiveOffers(data))
            .catch((error) => console.log(error));
    }, []);

    const carsWithBase64Images = cars.map((carEntry) => ({
        ...carEntry,
        image:
            carEntry.images.length > 0
                ? `${carEntry.images[0].image_base64}`
                : "",
    }));

    const exclusiveWithBase64Images = exclusiveOffers.map((carEntry) => ({
        ...carEntry,
        image:
          carEntry.images.length > 0
            ? `${carEntry.images[0].image_base64}`
            : "",
      }));


    return <div>
        <div id="carouselExampleDark" className="carousel carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="10000">
                    <img src="../images/beemer.jpeg" className="d-block w-100" alt="..."></img>
                    <div className="carousel-caption carousel-caption-center d-none d-md-block">
                        <h2 className="home-text">WELCOME</h2>
                        <p className="home-text">Discover a world of opulence with our luxury and exotic cars.</p>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                    <img src="https://media.washtimes.com/media/image/2023/04/12/EPA_Electric_Vehicles_14330.jpg" className="d-block w-100" alt="..."></img>
                    <div className="carousel-caption carousel-caption-center d-none d-md-block">
                        <h2 className="home-text">E-MOBILITY AFRICA</h2>
                        <p className="home-text">Explore the future of transportation with cutting-edge electric vehicles.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="../images/spares.jpeg" className="d-block w-100" alt="..."></img>
                    <div className="carousel-caption d-none carousel-caption-center d-md-block">
                        <h2 className="home-text">SPARE PARTS</h2>
                        <p className="home-text">Discover a wide selection of quality spare parts for cars.</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>

        {/* exclusive offers section */}

        <div className="container section-two">
            <h1 className="heading-label">EXCLUSIVE OFFERS</h1>
            <div className="row">
                {exclusiveWithBase64Images.slice(-4).map((carEntry) => (
                    <ExclusiveOffersCard
                        key={carEntry.id}
                        id={carEntry.id}
                        name={carEntry.name}
                        price={carEntry.price}
                        image={carEntry.image}
                    />
                ))}
            </div>
        </div>
        {/* whats new section */}

        <div className="container section-three">
            <div className="home-demo">
                <h1 className="heading-label">WHAT'S NEW</h1>
                <OwlCarousel
                    className="owl-theme"
                    items={3}
                    responsive={{
                        0: { items: 1 },
                        868: { items: 3 },
                    }}
                >
                    {carsWithBase64Images.slice(-6).map((carEntry) => (
                        <WhatsnewCard
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


        {/* where to find us section */}

        <div className="location">
            <div className="title-block">
                <h1 className="title">WHERE TO FIND US</h1>
            </div>
            <div className="text-block container">
                <i className="fa-sharp fa-solid fa-location-dot icon-4x"></i>
                <h2>Nairobi</h2>
                <p>What a beautiful sunrise</p>
            </div>
        </div>



        {/* testimonials */}
        <div className="demo">
            <div className="container">
                <h1 className="heading-section heading-label">TESTIMONIALS</h1>
                <div className="row testimonial-row">

                    {testimony.map((testimonyEntry) => (
                        <TestimonialCard
                            key={testimonyEntry.id}
                            name={testimonyEntry.name}
                            description={testimonyEntry.testimony}
                        />
                    ))}

                </div>
            </div>
        </div>
    </div>
}

export default HomePage;