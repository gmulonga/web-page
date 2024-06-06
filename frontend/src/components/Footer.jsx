import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';


var year = new Date().getFullYear();

function isValidEmail(email) {
  // Regular expression pattern to validate an email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function handleSubscribe() {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value;

  if (isValidEmail(email)) {
    axios.post(`${URL}/subscribe`, { email })
      .then((response) => {
        alert(response.data);
        // console.log(response);
      })
      .catch((error) => {
        alert('Error:', error);
        console.log('Error:', error);
      });
  } else {
    alert('Invalid email format'); // Show an error message for invalid email
  }
}


const handleButtonClick = () => {
  axios.get(`${URL}/emails`)
    .then((response) => {
      console.log(response.data); // Display the response from the server

    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error (e.g., show an error message to the user)
    });
};


function Footer() {
  const [partnerList, setPartnerList] = useState([]);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${URL}/get_partners`);
      setPartnerList(response.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const partnersWithBase64Images = partnerList.map(partnerEntry => ({
    ...partnerEntry,
    images: partnerEntry.images || [],
  }));

  const [socialList, setSocialList] = useState([]);

  useEffect(() => {
    fetchSocial();
  }, []);

  const fetchSocial = async () => {
    try {
      const response = await axios.get(`${URL}/get_social`);
      setSocialList(response.data.social);
    } catch (error) {
      console.error('Error fetching social:', error);
    }
  };

  console.log(socialList);


  return (
    <div>

      <footer class="footer-06">
        <div class="footer-space">
          <div class="row align-items-center align-items-stretch mb-5">
            <div class="col-md-4 py-4 py-md-5 aside-stretch d-flex align-items-center">
              <div class="w-100">
                <span class="subheading">Subscribe to our</span>
                <h3 class="heading-section">Newsletter</h3>
              </div>
            </div>


            <div class="col-md-8 py-4 py-md-5 d-flex align-items-center pl-md-5 aside-stretch-right">
              <form class="subscribe-form w-100">
                <div class="form-group d-flex">
                  <input type="text" name="name" id="emailInput" placeholder="Enter Email address" />
                  <button type="submit" class="form-control submit" onClick={handleSubscribe} ><span>Subscribe</span></button>
                </div>
              </form>
            </div>



          </div>
          <div class="row">

            {/* <div class="col-md-9 col-lg-6"> */}
            <div class="row">
              <div class="col-lg-6">
                <h3 className="title footer-text f-header">Contact Us</h3>
                <div className="footer-desc">
                  <p className="footer-text"> <a className="btn btn-outline-light btn-social mx-3" href=""><i className="fa-solid fa-phone"></i></a> {socialList.length > 0 && socialList[0].phone}</p>
                  <p className="footer-text"> <a className="btn btn-outline-light btn-social mx-3" href=""><i className="fab fa-fw fa-instagram"></i></a>{socialList.length > 0 && socialList[0].instagram}</p>
                  <p className="footer-text"><a className="btn btn-outline-light btn-social mx-3" href=""><i className="fa-solid fa-envelope"></i></a>{socialList.length > 0 && socialList[0].email}</p>
                  <p className="footer-text"><a className="btn btn-outline-light btn-social mx-3" href=""><i className="fab fa-fw fa-twitter"></i></a> {socialList.length > 0 && socialList[0].twitter}</p>
                </div>
              </div>
              <div class="col-lg-6">
                <h3 className="title footer-text f-header">About Us</h3>
                <p className="footer-text">Car Connect is a comprehensive online platform designed to connect car enthusiasts, buyers, and sellers in one convenient place. Our website serves as a hub for everything related to cars, providing a seamless experience for individuals looking to explore, research, and engage with the automotive world.
                  At Car Connect, we understand the diverse needs and preferences of car enthusiasts. Whether you're a first-time buyer or a seasoned car lover, our website caters to all levels of expertise and interests. We strive to empower our users with the knowledge, resources, and tools necessary to make informed decisions throughout the car-buying journey.</p>
              </div>

            </div>
            <div className="center-patner container">
              <div className='center-header'>
                <h2 className="title footer-text f-header">Partners</h2>
              </div>
            </div>
            <div>
              <p className="copyright">Car Connect © {year}</p>
            </div>
          </div>
        </div>
        {/* </div> */}
      </footer>

    </div>
  );
}

export default Footer;

