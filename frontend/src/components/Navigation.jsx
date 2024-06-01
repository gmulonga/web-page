import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import Logo from "./Logo";






function Navbar() {
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    const test = () => {
      const tabsNewAnim = $('#navbarSupportedContent');
      const selectorNewAnim = $('#navbarSupportedContent').find('li').length;
      const activeItemNewAnim = tabsNewAnim.find('.active');
      const activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
      const activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
      const itemPosNewAnimTop = activeItemNewAnim.position();
      const itemPosNewAnimLeft = activeItemNewAnim.position();
      $('#navbarSupportedContent ul li').removeClass('active');


      const path = window.location.pathname;


      const target = $(`#navbarSupportedContent ul li a[href="${path}"]`);
      target.parent().addClass('active');
      const horiSelector = $('.hori-selector');
      horiSelector.css({
        'top': `${itemPosNewAnimTop.top}px`,
        'left': `${itemPosNewAnimLeft.left}px`,
        'height': `${activeWidthNewAnimHeight}px`,
        'width': `${activeWidthNewAnimWidth}px`
      });


      $('#navbarSupportedContent ul li').removeClass('active');
      activeItemNewAnim.addClass('active');
    
     

      $('#navbarSupportedContent').on('click', 'li', function (e) {
        $('#navbarSupportedContent ul li').removeClass('active');
        $(this).addClass('active');
        const activeWidthNewAnimHeight = $(this).innerHeight();
        const activeWidthNewAnimWidth = $(this).innerWidth();
        const itemPosNewAnimTop = $(this).position();
        const itemPosNewAnimLeft = $(this).position();
        horiSelector.css({
          'top': `${itemPosNewAnimTop.top}px`,
          'left': `${itemPosNewAnimLeft.left}px`,
          'height': `${activeWidthNewAnimHeight}px`,
          'width': `${activeWidthNewAnimWidth}px`
        });
      });
    };


    test();
    $(document).ready(function () {
      setTimeout(function () {
        test();
      });
    });
    $(window).on('resize', function () {
      setTimeout(function () {
        test();
      }, 500);
    });
    $('.navbar-toggler').click(function () {
      $('.navbar-collapse').slideToggle(600);
      setTimeout(function () {
        test();
      });
    });


    // Add active class to the target link on page load
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const target = $(`#navbarSupportedContent ul li a[href="${path}"]`);
    target.parent().addClass('active');
  }, []);




  return (
    <nav className={`navbar navbar-expand-custom navbar-mainbg ${isOpen ? 'open' : ''}`} style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
  <div style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px' }}>
    <Logo />
  </div>
  <h2 className="company-name title">Car Connect</h2>
  <button
    className={`navbar-toggler ${isOpen ? 'open' : ''}`}
    type="button"
    onClick={toggleMenu}
    aria-label="Toggle navigation"
  >
    <i className="fas fa-bars text-white"></i>
  </button>
  <div className={`collapse navbar-collapse justify-content-center ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
    <ul className="navbar-nav ml-auto">
      <div className="hori-selector">
        <div className="left"></div>
        <div className="right"></div>
      </div>
      <li className="nav-item active">
        <Link to="/" className="nav-link active" aria-current="page">Home</Link>
      </li>
      <li className="nav-item">
        <Link to="/cars" className="nav-link">Cars</Link>
      </li>
      <li className="nav-item">
        <Link to="/evs" className="nav-link">Evs</Link>
      </li>
      <li className="nav-item">
        <Link to="/spares" className="nav-link">Spares</Link>
      </li>
      <li className="nav-item">
        <Link to="/about" className="nav-link">About</Link>
      </li>
    </ul>
  </div>
</nav>

  );
}


export default Navbar;