import React from "react";

function PatnerIcon(props) {
  return (
    <div className="col-lg-2 col-md-2 col-sm-2 patner">
      <img className="footer-img" src={props.image} alt="" />
    </div>
  );
}

export default PatnerIcon;
