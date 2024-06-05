import React from "react";
import "../styles/slider.css";

function Slider() {
  return (
    <div className="slider">
      <input type="radio" name="slider" title="slide1" checked className="slider__nav" />
      <input type="radio" name="slider" title="slide2" className="slider__nav" />
      <input type="radio" name="slider" title="slide3" className="slider__nav" />
      <input type="radio" name="slider" title="slide4" className="slider__nav" />
      <div className="slider__inner">
        <div className="slider__contents">
          <img src="../images/beemer.jpeg" alt="car image" />
          <h2 className="slider__caption">Car Connect</h2>
          <p className="slider__txt">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate omnis possimus illo quos,
            corporis minima!
          </p>
        </div>

        <div className="slider__contents">
          <img src="../images/mercedece.webp" alt="car image" />
          <h2 className="slider__caption">Car Connect</h2>
          <p className="slider__txt">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate omnis possimus illo quos,
            corporis minima!
          </p>
        </div>

        <div className="slider__contents">
          <img src="../images/rangerover.webp" alt="car image" />
          <h2 className="slider__caption">Car Connect</h2>
          <p className="slider__txt">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate omnis possimus illo quos,
            corporis minima!
          </p>
        </div>

        <div className="slider__contents">
          <img src="../images/beemer.jpeg" alt="car image" />
          <h2 className="slider__caption">Car Connect</h2>
          <p className="slider__txt">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate omnis possimus illo quos,
            corporis minima!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Slider;

