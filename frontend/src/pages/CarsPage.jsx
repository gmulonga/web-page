import React, { useEffect, useState } from "react";
import CarCard from "../components/CarCard";
import HeaderPage from "../components/HeaderPage";
import { URL } from "../constants"

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [carType, setCarType] = useState(null);

  useEffect(() => {
    fetch(`${URL}/cars`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((error) => console.error("Error fetching cars", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const carName = event.target.elements.query.value;
    setSearchQuery(carName);

    if (carName) {
      try {
        const response = await fetch(`${URL}/cars/${carName}`);
        if (response.ok) {
          const carsData = await response.json();
          setCarType(carsData);
        } else {
          console.error("Failed to fetch cars");
        }
      } catch (error) {
        console.error("Error fetching cars", error);
      }
    }
  };

  const filteredCars = searchQuery
    ? cars.filter((carEntry) =>
        carEntry.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cars;

  const carsWithBase64Images = filteredCars.map((carEntry) => ({
    ...carEntry,
    image:
      carEntry.images.length > 0
        ? `${carEntry.images[0].image_base64}`
        : "", 
  }));

  return (
    <div>
      <HeaderPage
        label="Luxury cars that ignite your passion. Unleash exhilaration at Speedster Automotive."
        image="../images/beemer.jpeg"
      />

      <div className="container">
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
                <i className="fa fa-search searchIcon" />{" "}
                <span className="car-name-white">Search Car</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container cars-page">
        <div className="row">
          {carsWithBase64Images.length === 0 ? (
            <h3 className="err title">No cars found!</h3>
          ) : (
            carsWithBase64Images.map((carEntry) => (
              <CarCard
                key={carEntry.id}
                id={carEntry.id}
                year={carEntry.year}
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

export default CarsPage;
