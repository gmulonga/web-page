import React from "react";

function TestimonialCard(props) {
    return <div className="col-lg-4 col-md-6">
        <div className="testimonial">
            <div className="testimonial-content">
                <div className="testimonial-icon">
                    <i className="fa fa-quote-left"></i>
                </div>
                <p className="description">
                    {props.description}
                </p>
            </div>
            <h3 className="title">{props.name}</h3>

        </div>
    </div>
}

export default TestimonialCard;