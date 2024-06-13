import React from "react";

function LogoItems(props) {
  const handleClick = () => {
    if (props.onClick) {
      props.onCarClick(props.image);

    }
  };

  return (
    <div className="card card-style car-logo" onClick={handleClick}>
      <img src={props.image} className="car-logo-image" alt="img1" />
    </div>
  );
}

export default LogoItems;
