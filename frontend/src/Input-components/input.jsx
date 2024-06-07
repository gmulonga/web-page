import React from "react";

function CustomInput({ name, id, value, onChange }) {
    return (
        <div className="custom-input-container">
            <label htmlFor={id} className="custom-input-label">{name}:</label>
            <input
                type="text"
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="custom-input"
            />
        </div>
    );
}

export default CustomInput;