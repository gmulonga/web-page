import React from 'react';

function CustomDropdown({ label, id, name, value, onChange, options }) {
    return (
        <div className="custom-dropdown-container full-width">
            <label htmlFor={id} className="car-text">{label}:</label><br />
            <select id={id} name={name} className="selector-style" value={value} onChange={onChange}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select><br />
        </div>
    );
}

export default CustomDropdown;
