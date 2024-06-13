import React from "react";


function HeaderPage(props) {
    return <div className="page-header">
        <img src={props.image} alt="" />
        <div className="image-overlay">
            <h5 className="overlay-text head-txt slideDelay">{props.label}</h5>
        </div>
    </div>

}

export default HeaderPage;