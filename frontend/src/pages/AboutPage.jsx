import React, { useState, useEffect } from "react";
import HeaderPage from "../components/HeaderPage";
import axios from "axios";
import { URL } from "../constants";

function AboutPage() {
    const [aboutContent, setAboutContent] = useState([]);

    useEffect(() => {
        axios.get(`${URL}/get_about_us`)
            .then((response) => {
                const aboutUsData = response.data;
                setAboutContent(aboutUsData);
            })
            .catch((error) => {
                console.error("Error fetching About Us content:", error);
            });
    }, []);

    return (
        <div>
            <HeaderPage label="About Us" image="../images/beemer.jpeg" />
            <div className="about-us">
                {aboutContent.map((section) => (
                    <div key={section.id} className="who-we-are">
                        <div className="container">
                            <div dangerouslySetInnerHTML={{ __html: section.about }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AboutPage;
