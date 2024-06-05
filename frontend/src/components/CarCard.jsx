import React from "react";
import { useNavigate } from "react-router-dom";


function CarCard(props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cars/${props.id}`);
  };

  return (
    <div className="card-style col-lg-4">
      <div className="card car-card" onClick={handleClick}>
        <img src={props.image} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title car-name">{props.year} {props.name}</h5>
          <p className="card-text car-name">Ksh {props.price}</p>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
