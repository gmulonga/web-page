import React from "react";
import { useNavigate } from "react-router-dom";

function WhatsnewCard(props) {

    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/cars/${props.id}`);
    };
    
    return <div className="card card-style" onClick={handleClick}>
            <img src={props.image} className="card-img-top" alt="img1" />
            <div className="card-body">
                <h5 className="card-title car-name">{props.name}</h5>
                <p className="card-text car-name">Ksh{props.price}</p>
            </div>
        </div>
    
}


export default WhatsnewCard;