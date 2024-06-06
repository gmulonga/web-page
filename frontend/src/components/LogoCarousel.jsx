import React from "react";
import LogoItems from "./LogoItems";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import CarLogos from "./CarLogos";



function LogoCarousel() {
  const logoItems = Object.values(CarLogos()).map((logo, index) => (
    <LogoItems key={index} image={logo.image} name={logo.name} />
  ));

  return (
    <div>
      <OwlCarousel
        className="owl-theme"
        items={5}
        responsive={{
          0: { items: 3 },
          868: { items: 7 },
        }}
      >
        {logoItems}
      </OwlCarousel>
    </div>
  );
}

export default LogoCarousel;
