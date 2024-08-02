import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';
import { isValidEmail } from '../utilis/utilis';
import Message from './Message';

const Footer = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [partnerList, setPartnerList] = useState([]);
  const [socialList, setSocialList] = useState([]);
  const year = new Date().getFullYear();


  const handleSubscribe = (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;

    if (isValidEmail(email)) {
      axios.post(`${URL}/subscribe`, { email })
        .then((response) => {
          alert(response.data);
        })
        .catch((error) => {
          alert('Error:', error);
          console.error('Error:', error);
        });
    } else {
      setMessage('Invalid Email format');
      setAlertType('alert-danger');
      setShowMessage(true);
    }
  };


  return (
    <div>
      {showMessage && (
            <Message
                message={message}
                onClose={() => setShowMessage(false)}
                alertType={alertType}
            />
        )}
      <footer className="footer-06">
        <div className="footer-space">
          <div className="row align-items-center align-items-stretch mb-5">
            <div className="col-md-4 py-4 py-md-5 aside-stretch d-flex align-items-center">
              <div className="w-100">
                <span className="subheading">Subscribe to our</span>
                <h3 className="heading-section">Newsletter</h3>
              </div>
            </div>
            <div className="col-md-8 py-4 py-md-5 d-flex align-items-center pl-md-5 aside-stretch-right">
              <form className="subscribe-form w-100" onSubmit={handleSubscribe}>
                <div className="form-group d-flex">
                  <input type="text" name="name" id="emailInput" placeholder="Enter Email address" />
                  <button type="submit" className="form-control submit"><span>Subscribe</span></button>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <div className="col-lg-6">
                <h3 className="title footer-text f-header">Contact Us</h3>
                <div className="footer-desc">
                  <p className="footer-text">
                    <a className="btn btn-outline-light btn-social mx-3" href="">
                      <i className="fa-solid fa-phone"></i>
                    </a>
                    {socialList.length > 0 && socialList[0].phone}
                  </p>
                  <p className="footer-text">
                    <a className="btn btn-outline-light btn-social mx-3" href="">
                      <i className="fab fa-fw fa-instagram"></i>
                    </a>
                    {socialList.length > 0 && socialList[0].instagram}
                  </p>
                  <p className="footer-text">
                    <a className="btn btn-outline-light btn-social mx-3" href="">
                      <i className="fa-solid fa-envelope"></i>
                    </a>
                    {socialList.length > 0 && socialList[0].email}
                  </p>
                  <p className="footer-text">
                    <a className="btn btn-outline-light btn-social mx-3" href="">
                      <i className="fab fa-fw fa-twitter"></i>
                    </a>
                    {socialList.length > 0 && socialList[0].twitter}
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <h3 className="title footer-text f-header">About Us</h3>
                <p className="footer-text">
                  Car Connect is a comprehensive online platform designed to connect car enthusiasts, buyers, and sellers in one convenient place. Our website serves as a hub for everything related to cars, providing a seamless experience for individuals looking to explore, research, and engage with the automotive world.
                  At Car Connect, we understand the diverse needs and preferences of car enthusiasts. Whether you're a first-time buyer or a seasoned car lover, our website caters to all levels of expertise and interests. We strive to empower our users with the knowledge, resources, and tools necessary to make informed decisions throughout the car-buying journey.
                </p>
              </div>
            </div>
            <div className="center-patner container">
              <div className="center-header">
                <h2 className="title footer-text f-header">Partners</h2>
              </div>
            </div>
            <div>
              <p className="copyright">Car Connect © {year}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
