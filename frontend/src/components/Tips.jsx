import React from "react";


function Tips(props) {
    return (
        <div>
            <ul>
                <li><h5>{props.title} </h5></li>
                <p>{props.description}</p>
            </ul>
        </div>
    );
}

export default Tips;