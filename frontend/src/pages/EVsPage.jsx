import React, { useEffect, useState } from "react";
import HeaderPage from "../components/HeaderPage";
import CarCard from "../components/CarCard";
import CarsAPI from "../services/carsAPI";


function EVspage() {
    const [cars, setCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [carType, setCarType] = useState(null);
    const carsApi = new CarsAPI();

    useEffect(() => {
        const fetchCars = async () => {
            const { data } = await carsApi.getEVs();
            setCars(data);
        };
        fetchCars();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const carName = event.target.elements.query.value;
        setSearchQuery(carName);

        const { data } = await carsApi.getEVsByName(carName);
        setCarType(data);
    };

    const carsWithBase64Images = cars.map((carEntry) => ({
        ...carEntry,
        image: carEntry.images.length > 0 ? `${carEntry.images[0].image_base64}` : "",
    }));

    const filteredCars = searchQuery
        ? carsWithBase64Images.filter((carEntry) =>
            carEntry.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : carsWithBase64Images;

    return (
        <div>

            <HeaderPage
                label="Discover the Future: Explore Our Electric Vehicle Car Collection Today!"
                image="https://www.goldmansachs.com/intelligence/pages/articles/electric-vehicles-are-forecast-to-be-half-of-global-car-sales-by-2035/image-800x450.jpg"
            />
            <div className="container">
                <div>
                    <div className="align-items-center pl-md-5 aside-stretch-right">
                        <form className="search-form w-100" onSubmit={handleSubmit}>
                            <div className="search-group d-flex">
                                <input
                                    type="text"
                                    className="searchTerm"
                                    name="query"
                                    placeholder="Search for a car"
                                />
                                <button type="submit" className="form-control submit">
                                    <i className="fa fa-search searchIcon"></i>{" "}
                                    <span className="car-name-white">Search Car</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container cars-page">
                <div className="row">
                    {carsWithBase64Images.length === 0 ? (
                        <h3 className="err title">No EV cars found!</h3>
                    ) : (
                        carsWithBase64Images.map((carEntry) => (
                            <CarCard
                                key={carEntry.id}
                                id={carEntry.id}
                                image={carEntry.image}
                                name={carEntry.name}
                                price={carEntry.price}
                            />
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}


export default EVspage;