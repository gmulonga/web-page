import React from "react";


function SelectedCarImages(props) {

    const handleClick = () => {
        props.onClick(props.image);
      };

    return (
        <div className="item">
            <div>
                <div className="item-wrapper">
                    <img
                        className="selected-car-slider"
                        data-imgbigurl={props.image}
                        src={props.image}
                        alt="image"
                        onClick={handleClick}
                    />
                </div>
            </div>
        </div>
    );
}


export default SelectedCarImages;