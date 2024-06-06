import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ExclusiveOffersCard(props) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/car/${props.id}`);
  };

  return (
    <div className="col-sm-6">
      <div className="card exclusive-offer-card card-style" onClick={handleClick}>
        <div className="card-overlay">
          <h1 className="card-title car-name-white">{props.name}</h1>
          <h4 className="card-text car-name-white">Ksh {props.price}</h4>
        </div>

        {props.image && (
          <img
            src={props.image}
            className="card-img-top"
            alt={`exclusive offer ${props.id}`}
          />
        )}
      </div>
    </div>
  );
}

export default ExclusiveOffersCard;
